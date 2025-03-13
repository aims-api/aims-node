import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../../src/consts'

import {
  responseDataByClientId,
  responseDataByClientIdDetailed,
  responseDataBySystemId,
  responseDataBySystemIdDetailed,
} from '../dataMocks'
import { testClient } from '../helpers'

const base = `${API_HOST}/${API_VERSION}/tracks`
const queryBySystemIdPath = `${base}/system/1`
const queryByClientIdPath = `${base}/client/1`

const server = setupServer(
  rest.post(queryBySystemIdPath, (req, res, ctx) => res(ctx.json({}))),
  rest.post(queryByClientIdPath, (req, res, ctx) => res(ctx.json({}))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(queryBySystemIdPath, (req, res, ctx) => {
      if (req.url.searchParams.get('detailed') === 'true') {
        return res(ctx.status(status), ctx.json(responseDataBySystemIdDetailed))
      }
      return res(ctx.status(status), ctx.json(responseDataBySystemId))
    }),
    rest.post(queryByClientIdPath, (req, res, ctx) => {
      if (req.url.searchParams.get('detailed') === 'true') {
        return res(ctx.status(status), ctx.json(responseDataByClientIdDetailed))
      }
      return res(ctx.status(status), ctx.json(responseDataByClientId))
    }),
  )
}

describe('updateTrack', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('by system id', () => {
    test('success, return data, not detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.update({
        system_id: '1',
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataBySystemId,
      })
    })

    test('success, return data, detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.update({
        system_id: '1',
        detailed: true,
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataBySystemIdDetailed,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.update({
        system_id: '1',
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.update({
        system_id: '1',
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('by client id', () => {
    test('success, return data, not detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.update({
        client_id: '1',
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataByClientId,
      })
    })

    test('success, return data, detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.update({
        client_id: '1',
        detailed: true,
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataByClientIdDetailed,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.update({
        client_id: '1',
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.update({
        client_id: '1',
        data: {
          version_name: 'version_name',
          active: true,
        },
      })
      expect(response.success).toEqual(false)
    })
  })
})
