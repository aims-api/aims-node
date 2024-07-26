import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { CountResponse } from '../../src/helpers/types'

const countResponse: CountResponse = {
  length: 8392,
}

const countPath = `${API_HOST}/${API_VERSION}/tags/length`

const server = setupServer(rest.get(countPath, (req, res, ctx) => res(ctx.json({}))))

const mockServerBodyData = (status: number) => {
  server.use(rest.get(countPath, (req, res, ctx) => res(ctx.status(status), ctx.json(countResponse))))
}

describe('countTags', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.tag.count()
    expect(response).toEqual({
      success: true,
      data: countResponse,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.tag.count()
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.tag.count()
    expect(response.success).toEqual(false)
  })
})
