import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { SimilarSearchResponse } from '../../src/helpers/types/track'
import { generalTrackProps } from '../dataMocks'

const responseDataByFileHash: SimilarSearchResponse = {
  query_id: 'by-file-hash',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track by-file-hash',
    },
  ],
}

const queryByAudioFileHashPath = `${API_HOST}/${API_VERSION}/query/by-file-hash`

const server = setupServer(rest.post(queryByAudioFileHashPath, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(queryByAudioFileHashPath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataByFileHash))),
  )
}

describe('Query - byAudioFileHash', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.query.byAudioFileHash({
      hash: 'hash',
      page: 1,
      page_size: 20,
      time_offset: 5,
      time_limit: 10,
      suppress_vocals: true,
      prioritise_bpm: false,
    })
    expect(response).toEqual({
      success: true,
      data: responseDataByFileHash,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.query.byAudioFileHash({
      hash: 'hash',
      page: 1,
      page_size: 20,
      time_offset: 5,
      time_limit: 10,
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.query.byAudioFileHash({
      hash: 'hash',
      page: 1,
      page_size: 20,
      time_offset: 5,
      time_limit: 10,
    })
    expect(response.success).toEqual(false)
  })
})
