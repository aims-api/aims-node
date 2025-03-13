import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../../src/consts'

import { SimilarSearchResponse } from '../../src/helpers/types/track'
import { generalTrackProps } from '../dataMocks'
import { testClient } from '../helpers'

const responseDataById: SimilarSearchResponse = {
  query_id: 'by-id',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track by-id',
    },
  ],
}

const queryByIdPath = `${API_HOST}/${API_VERSION}/query/by-id`

const server = setupServer(rest.post(queryByIdPath, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(queryByIdPath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataById))))
}

describe('Query - byId', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.query.byId({
      track_id: '1',
    })
    expect(response).toEqual({
      success: true,
      data: responseDataById,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.query.byId({
      track_id: '1',
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.query.byId({
      track_id: '1',
    })
    expect(response.success).toEqual(false)
  })
})
