import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { SimilarSearchResponse } from '../../src/helpers/types/track'
import { generalTrackProps } from '../dataMocks'

const responseDataByFileUrl: SimilarSearchResponse = {
  query_id: 'by-file-url',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track by-file-url',
    },
  ],
}

const queryByFileUrlPath = `${API_HOST}/${API_VERSION}/query/by-file-url`

const server = setupServer(rest.post(queryByFileUrlPath, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(queryByFileUrlPath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataByFileUrl))))
}

describe('Query - byFileUrl', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.query.byFileUrl({
      track: 'track',
    })
    expect(response).toEqual({
      success: true,
      data: responseDataByFileUrl,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.query.byFileUrl({
      track: 'track',
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.query.byFileUrl({
      track: 'track',
    })
    expect(response.success).toEqual(false)
  })
})
