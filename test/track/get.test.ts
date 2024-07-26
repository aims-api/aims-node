import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import {
  responseDataByClientId,
  responseDataByClientIdDetailed,
  responseDataBySystemId,
  responseDataBySystemIdDetailed,
} from '../dataMocks'

const base = `${API_HOST}/${API_VERSION}/tracks`
const queryBySystemIdPath = `${base}/system/1`
const queryByClientIdPath = `${base}/client/1`

const server = setupServer(
  rest.get(queryBySystemIdPath, (req, res, ctx) => res(ctx.json({}))),
  rest.get(queryByClientIdPath, (req, res, ctx) => res(ctx.json({}))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.get(queryBySystemIdPath, (req, res, ctx) => {
      if (req.url.searchParams.get('detailed') === 'true') {
        return res(ctx.status(status), ctx.json(responseDataBySystemIdDetailed))
      }
      return res(ctx.status(status), ctx.json(responseDataBySystemId))
    }),
    rest.get(queryByClientIdPath, (req, res, ctx) => {
      if (req.url.searchParams.get('detailed') === 'true') {
        return res(ctx.status(status), ctx.json(responseDataByClientIdDetailed))
      }
      return res(ctx.status(status), ctx.json(responseDataByClientId))
    }),
  )
}

describe('getTrack', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('by system id', () => {
    test('success, return data, not detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.get({
        system_id: '1',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataBySystemId,
      })
    })

    test('success, return data, detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.get({
        system_id: '1',
        params: {
          detailed: true,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataBySystemIdDetailed,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.get({
        system_id: '1',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.get({
        system_id: '1',
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('by client id', () => {
    test('success, return data, not detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.get({
        client_id: '1',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataByClientId,
      })
    })

    test('success, return data, detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.get({
        client_id: '1',
        params: {
          detailed: true,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataByClientIdDetailed,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.get({
        client_id: '1',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.get({
        client_id: '1',
      })
      expect(response.success).toEqual(false)
    })
  })
})
