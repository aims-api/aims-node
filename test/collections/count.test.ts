import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { API_HOST, API_VERSION } from '../../src/consts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { CountResponse } from '../../src/helpers/types'

const responseDataProjects: CountResponse = {
  length: 12,
}

const responseDataPlaylists: CountResponse = {
  length: 98,
}

const responseDataCustomTags: CountResponse = {
  length: 123,
}

const pathProjects = `${API_HOST}/${API_VERSION}/project/length`
const pathPlaylists = `${API_HOST}/${API_VERSION}/playlist/length`
const pathCustomTags = `${API_HOST}/${API_VERSION}/custom-tag/length`

const server = setupServer(
  rest.get(pathProjects, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathPlaylists, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathCustomTags, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.get(pathProjects, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataProjects))),
    rest.get(pathPlaylists, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataPlaylists))),
    rest.get(pathCustomTags, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataCustomTags))),
  )
}

describe('Collections - count', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.project.count()
      expect(response).toEqual({
        success: true,
        data: responseDataProjects,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.project.count()
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.project.count()
      expect(response.success).toEqual(false)
    })
  })

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.count()
      expect(response).toEqual({
        success: true,
        data: responseDataPlaylists,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.count()
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.count()
      expect(response.success).toEqual(false)
    })
  })

  describe('Custom tags', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.customTag.count()
      expect(response).toEqual({
        success: true,
        data: responseDataCustomTags,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.customTag.count()
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.customTag.count()
      expect(response.success).toEqual(false)
    })
  })
})
