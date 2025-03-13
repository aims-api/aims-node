import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../src/consts'
import { MessageResponse } from '../../src/helpers/types'
import { testClient } from '../helpers'

const projectById: MessageResponse = {
  message: 'Project deleted by id',
}

const projectByKey: MessageResponse = {
  message: 'Project deleted by key',
}

const playlistById: MessageResponse = {
  message: 'Playlist deleted by id',
}

const playlistByKey: MessageResponse = {
  message: 'Playlist deleted by key',
}

const customTagById: MessageResponse = {
  message: 'Custom tag deleted by id',
}

const customTagByKey: MessageResponse = {
  message: 'Custom tag deleted by key',
}

const pathProjectById = `${API_HOST}/${API_VERSION}/project/delete/by-id/project-id`
const pathProjectByKey = `${API_HOST}/${API_VERSION}/project/delete/by-key/project-key`
const pathPlaylistById = `${API_HOST}/${API_VERSION}/playlist/delete/by-id/playlist-id`
const pathPlaylistByKey = `${API_HOST}/${API_VERSION}/playlist/delete/by-key/playlist-key`
const pathCustomTagById = `${API_HOST}/${API_VERSION}/custom-tag/delete/by-id/custom-tag-id`
const pathCustomTagByKey = `${API_HOST}/${API_VERSION}/custom-tag/delete/by-key/custom-tag-key`

const server = setupServer(
  rest.delete(pathProjectById, (req, res, ctx) => res(ctx.json([]))),
  rest.delete(pathProjectByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.delete(pathPlaylistById, (req, res, ctx) => res(ctx.json([]))),
  rest.delete(pathPlaylistByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.delete(pathCustomTagById, (req, res, ctx) => res(ctx.json([]))),
  rest.delete(pathCustomTagByKey, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.delete(pathProjectById, (req, res, ctx) => res(ctx.status(status), ctx.json(projectById))),
    rest.delete(pathProjectByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(projectByKey))),
    rest.delete(pathPlaylistById, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistById))),
    rest.delete(pathPlaylistByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistByKey))),
    rest.delete(pathCustomTagById, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagById))),
    rest.delete(pathCustomTagByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagByKey))),
  )
}

describe('Collections - delete', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.delete.byKey('project-key')
        expect(response).toEqual({
          success: true,
          data: projectByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.delete.byKey('project-key')
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.delete.byKey('project-key')
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.delete.byId('project-id')
        expect(response).toEqual({
          success: true,
          data: projectById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.delete.byId('project-id')
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.delete.byId('project-id')
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Playlists', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.delete.byKey('playlist-key')
        expect(response).toEqual({
          success: true,
          data: playlistByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.delete.byKey('playlist-key')
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.delete.byKey('playlist-key')
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.delete.byId('playlist-id')
        expect(response).toEqual({
          success: true,
          data: playlistById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.delete.byId('playlist-id')
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.delete.byId('playlist-id')
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Custom tag', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.delete.byKey('custom-tag-key')
        expect(response).toEqual({
          success: true,
          data: customTagByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.delete.byKey('custom-tag-key')
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.delete.byKey('custom-tag-key')
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.delete.byId('custom-tag-id')
        expect(response).toEqual({
          success: true,
          data: customTagById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.delete.byId('custom-tag-id')
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.delete.byId('custom-tag-id')
        expect(response.success).toEqual(false)
      })
    })
  })
})
