import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { ZodError } from 'zod'

import { testClient } from '../../helpers'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { CollectionsList } from '../../../src/helpers/types/collection'

const responseData: CollectionsList = {
  collections: [
    {
      id: 'collections-by-id',
      key: 'SPRT2',
      updated_at: '2021-09-24T11:45:37.000000Z',
      processed_at: '2021-09-24T11:45:37.000000Z',
      title: 'Hot Summer Time',
    },
  ],
  pagination: {
    item_count: 123,
  },
}

const path = `${API_HOST}/${API_VERSION}/artists/search`

const server = setupServer(rest.get(path, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.get(path, (req, res, ctx) => res(ctx.status(status), ctx.json(responseData))))
}

describe('Artists get - byTitle', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.artist.get.byTitle({
      page: 3,
      page_size: 5,
      title: 'Damon Albarn',
    })
    expect(response).toEqual({
      success: true,
      data: responseData,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.artist.get.byTitle({
      page: 3,
      page_size: 5,
      title: 'Damon Albarn',
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.artist.get.byTitle({
      page: 3,
      page_size: 5,
      title: 'Damon Albarn',
    })
    expect(response.success).toEqual(false)
  })
})
