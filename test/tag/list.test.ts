import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { TagListResponse } from '../../src/endpoints/tag/list'

const tagListResponse: TagListResponse = {
  tags: {
    genre: [
      {
        id: 1,
        title: 'genre 1',
      },
      {
        id: 2,
        title: 'genre 2',
      },
    ],
    instrument: [],
    mood: [],
    usage: [],
    decade: [],
    vocals: [],
  },
}

const listPath = `${API_HOST}/${API_VERSION}/tags`

const server = setupServer(rest.get(listPath, (req, res, ctx) => res(ctx.json({}))))

const mockServerBodyData = (status: number) => {
  server.use(rest.get(listPath, (req, res, ctx) => res(ctx.status(status), ctx.json(tagListResponse))))
}

describe('listTags', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.tag.list()
    expect(response).toEqual({
      success: true,
      data: tagListResponse,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.tag.list()
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.tag.list()
    expect(response.success).toEqual(false)
  })
})
