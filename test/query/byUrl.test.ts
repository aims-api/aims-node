import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../../src/consts'

import { SimilarSearchResponse } from '../../src/helpers/types/track'
import { generalTrackProps } from '../dataMocks'
import { testClient } from '../helpers'

const responseDataByUrl: SimilarSearchResponse = {
  query_id: 'by-url',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track by-url',
    },
  ],
}

const queryByUrlPath = `${API_HOST}/${API_VERSION}/query/by-url`

const server = setupServer(rest.post(queryByUrlPath, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(queryByUrlPath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataByUrl))))
}

describe('Query - byUrl', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.query.byUrl({
      link: 'link',
    })
    expect(response).toEqual({
      success: true,
      data: responseDataByUrl,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.query.byUrl({
      link: 'link',
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.query.byUrl({
      link: 'link',
    })
    expect(response.success).toEqual(false)
  })
})
