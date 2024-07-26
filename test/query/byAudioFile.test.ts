import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import fs from 'fs'
import path from 'path'
import { testClient } from '../helpers'
import { generalTrackProps } from '../dataMocks'
import { SimilarSearchResponse } from '../../src/helpers/types/track'

const responseDataByFile: SimilarSearchResponse = {
  query_id: 'by-file',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track by-file',
    },
  ],
}

const queryByFilePath = `${API_HOST}/${API_VERSION}/query/by-file`

const server = setupServer(rest.post(queryByFilePath, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(queryByFilePath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataByFile))))
}

describe('Query - byAudioFile', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.query.byAudioFile({
      track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
      page: 1,
      highlights: true,
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
      data: responseDataByFile,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.query.byAudioFile({
      track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.query.byAudioFile({
      track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
    })
    expect(response.success).toEqual(false)
  })
})
