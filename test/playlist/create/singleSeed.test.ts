import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import fs from 'node:fs'
import path from 'node:path'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { SimilarSearchDetailedResponse, SimilarSearchResponse } from '../../../src/helpers/types/track'
import { trackDetails } from '../../dataMocks'
import { generalTrackProps } from '../../dataMocks'
import { testClient } from '../../helpers'

const responseDataSingleSeed: SimilarSearchResponse = {
  query_id: 'single-seed',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track single-seed',
    },
  ],
}

const responseDataSingleSeedDetailed: SimilarSearchDetailedResponse = {
  query_id: 'single-seed-detailed',
  tracks: [
    {
      ...generalTrackProps,
      ...trackDetails,
      id: 1,
      track_name: 'track single-seed-detailed',
    },
  ],
}

const singleSeedPath = `${API_HOST}/${API_VERSION}/playlist/single-seed`

const server = setupServer(rest.post(singleSeedPath, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(singleSeedPath, (req, res, ctx) => {
      if (req.url.searchParams.get('detailed') === 'true') {
        return res(ctx.status(status), ctx.json(responseDataSingleSeedDetailed))
      }
      return res(ctx.status(status), ctx.json(responseDataSingleSeed))
    }),
  )
}

describe('Playlist create - single seed', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data, not detailed', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.playlist.build.singleSeed({
      data: {
        playlist_length: 123,
        track: {
          type: 'file',
          value: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        },
      },
      filter: {
        logic: 'and',
        conditions: [
          {
            field: 'track_name',
            operator: 'begins',
            value: 'B',
          },
        ],
      },
    })
    expect(response).toEqual({
      success: true,
      data: responseDataSingleSeed,
    })
  })

  test('success, return data, detailed', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.playlist.build.singleSeed({
      data: {
        playlist_length: 123,
        track: {
          type: 'file',
          value: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        },
      },
      params: { detailed: true },
      filter: {
        logic: 'and',
        conditions: [
          {
            field: 'track_name',
            operator: 'begins',
            value: 'B',
          },
        ],
      },
    })
    expect(response).toEqual({
      success: true,
      data: responseDataSingleSeedDetailed,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.playlist.build.singleSeed({
      data: {
        playlist_length: 123,
        track: {
          type: 'file',
          value: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        },
      },
      filter: {
        logic: 'and',
        conditions: [
          {
            field: 'track_name',
            operator: 'begins',
            value: 'B',
          },
        ],
      },
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.playlist.build.singleSeed({
      data: {
        playlist_length: 123,
        track: {
          type: 'file',
          value: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        },
      },
      filter: {
        logic: 'and',
        conditions: [
          {
            field: 'track_name',
            operator: 'begins',
            value: 'B',
          },
        ],
      },
    })
    expect(response.success).toEqual(false)
  })
})
