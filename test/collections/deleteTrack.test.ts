import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../src/consts'
import { MessageResponse } from '../../src/helpers/types'
import { testClient } from '../helpers'

const responseDataProjects: MessageResponse = {
  message: 'Deleted from project',
}

const responseDataPlaylists: MessageResponse = {
  message: 'Deleted from playlist',
}

const responseDataCustomTags: MessageResponse = {
  message: 'Deleted from custom tag',
}

const pathProjects = `${API_HOST}/${API_VERSION}/project/remove-track/by-id`
const pathPlaylists = `${API_HOST}/${API_VERSION}/playlist/remove-track/by-id`
const pathCustomTags = `${API_HOST}/${API_VERSION}/custom-tag/remove-track/by-id`

const server = setupServer(
  rest.post(pathProjects, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathPlaylists, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathCustomTags, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(pathProjects, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataProjects))),
    rest.post(pathPlaylists, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataPlaylists))),
    rest.post(pathCustomTags, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataCustomTags))),
  )
}

describe('Collections - deleteTrack', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.project.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataProjects,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.project.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.project.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataPlaylists,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Custom tags', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.customTag.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response).toEqual({
        success: true,
        data: responseDataCustomTags,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.customTag.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.customTag.removeTrack({
        track_id: '123',
        collection_key: 'key',
      })
      expect(response.success).toEqual(false)
    })
  })
})
