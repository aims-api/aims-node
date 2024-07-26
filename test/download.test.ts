import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../src/consts'
import { ZodError } from 'zod'

import { testClient } from './helpers'

const responseData = 'track-string-response'

const path = `${API_HOST}/${API_VERSION}/download/by-url`

const server = setupServer(rest.post(path, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(path, (req, res, ctx) => res(ctx.status(status), ctx.json(responseData))))
}

describe('Download', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('by-id', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.download({
        link: 'https://www.youtube.com/watch?v=I2sRc3j7IU0',
      })
      expect(response).toEqual({
        success: true,
        data: responseData,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.download({
        link: 'https://www.youtube.com/watch?v=I2sRc3j7IU0',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.download({
        link: 'https://www.youtube.com/watch?v=I2sRc3j7IU0',
      })
      expect(response.success).toEqual(false)
    })
  })
})
