import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../../src/consts'

import { MessageResponse } from '../../src/helpers/types'
import { testClient } from '../helpers'

const responseDataBySystemId: MessageResponse = {
  message: 'Track has been deleted by system id',
}

const responseDataByClientId: MessageResponse = {
  message: 'Track has been deleted by client id',
}

const base = `${API_HOST}/${API_VERSION}/tracks`
const deleteBySystemIdPath = `${base}/system/1`
const deleteByClientIdPath = `${base}/client/1`

const server = setupServer(
  rest.delete(deleteBySystemIdPath, (req, res, ctx) => res(ctx.json({}))),
  rest.delete(deleteByClientIdPath, (req, res, ctx) => res(ctx.json({}))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.delete(deleteBySystemIdPath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataBySystemId))),
    rest.delete(deleteByClientIdPath, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataByClientId))),
  )
}

describe('deleteTrack', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('by system id', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.delete({
        system_id: '1',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataBySystemId,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.delete({
        system_id: '1',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.delete({
        system_id: '1',
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('by client id', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.delete({
        client_id: '1',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataByClientId,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.delete({
        client_id: '1',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.delete({
        client_id: '1',
      })
      expect(response.success).toEqual(false)
    })
  })
})
