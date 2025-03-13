import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../src/consts'

import { testClient } from './helpers'

const responseData = {
  aggregations: null,
  did_you_mean: [],
  query_id: 'test',
  totals: {},
  tracks: [],
  type: 'tag',
}

const path = `${API_HOST}/${API_VERSION}/search`

const server = setupServer(rest.post(path, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(path, (req, res, ctx) => res(ctx.status(status), ctx.json(responseData))))
}

describe('Unified search', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.search({
      query: 'test',
      filter: {
        logic: 'and',
        conditions: [
          {
            field: 'release_year',
            operator: 'gte',
            value: 2020,
          },
        ],
      },
    })
    expect(response).toEqual({
      success: true,
      data: responseData,
    })
  })

  test('failure, zod response error', async () => {
    const response = await testClient.endpoints.search({
      query: 'test',
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.search({
      query: 'test',
    })
    expect(response.success).toEqual(false)
  })
})
