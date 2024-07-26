import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { ZodError } from 'zod'
import { testClient } from '../helpers'
import { API_HOST, API_VERSION } from '../../src/consts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { CollectionResponse } from '../../src/helpers/types/collection'

const projectById: CollectionResponse = {
  collection: {
    id: 'project-id',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const projectByKey: CollectionResponse = {
  collection: {
    id: 'project-key',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const playlistById: CollectionResponse = {
  collection: {
    id: 'playlist-id',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const playlistByKey: CollectionResponse = {
  collection: {
    id: 'playlist-key',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const customTagById: CollectionResponse = {
  collection: {
    id: 'custom-tag-id',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const customTagByKey: CollectionResponse = {
  collection: {
    id: 'custom-tag-key',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const pathProjectById = `${API_HOST}/${API_VERSION}/project/update/by-id/project-id`
const pathProjectByKey = `${API_HOST}/${API_VERSION}/project/update/by-key/project-key`
const pathPlaylistById = `${API_HOST}/${API_VERSION}/playlist/update/by-id/playlist-id`
const pathPlaylistByKey = `${API_HOST}/${API_VERSION}/playlist/update/by-key/playlist-key`
const pathCustomTagById = `${API_HOST}/${API_VERSION}/custom-tag/update/by-id/custom-tag-id`
const pathCustomTagByKey = `${API_HOST}/${API_VERSION}/custom-tag/update/by-key/custom-tag-key`

const server = setupServer(
  rest.post(pathProjectById, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathProjectByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathPlaylistById, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathPlaylistByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathCustomTagById, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathCustomTagByKey, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(pathProjectById, (req, res, ctx) => res(ctx.status(status), ctx.json(projectById))),
    rest.post(pathProjectByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(projectByKey))),
    rest.post(pathPlaylistById, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistById))),
    rest.post(pathPlaylistByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistByKey))),
    rest.post(pathCustomTagById, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagById))),
    rest.post(pathCustomTagByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagByKey))),
  )
}

describe('Collections - update', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'project-key',
        })
        expect(response).toEqual({
          success: true,
          data: projectByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'project-key',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'project-key',
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.update.byId({
          data: {
            title: 'new title',
          },
          id: 'project-id',
        })
        expect(response).toEqual({
          success: true,
          data: projectById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.update.byId({
          data: {
            title: 'new title',
          },
          id: 'project-id',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.update.byId({
          data: {
            title: 'new title',
          },
          id: 'project-id',
        })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Playlists', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'playlist-key',
        })
        expect(response).toEqual({
          success: true,
          data: playlistByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'playlist-key',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'playlist-key',
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.update.byId({
          data: {
            title: 'new title',
          },
          id: 'playlist-id',
        })
        expect(response).toEqual({
          success: true,
          data: playlistById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.update.byId({
          data: {
            title: 'new title',
          },
          id: 'playlist-id',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.update.byId({
          data: {
            title: 'new title',
          },
          id: 'playlist-id',
        })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Custom tags', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'custom-tag-key',
        })
        expect(response).toEqual({
          success: true,
          data: customTagByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'custom-tag-key',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.update.byKey({
          data: {
            title: 'new title',
          },
          id: 'custom-tag-key',
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.update.byId({
          data: {
            title: 'new title',
          },
          id: 'custom-tag-id',
        })
        expect(response).toEqual({
          success: true,
          data: customTagById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.update.byId({
          data: {
            title: 'new title',
          },
          id: 'custom-tag-id',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.update.byId({
          data: {
            title: 'new title',
          },
          id: 'custom-tag-id',
        })
        expect(response.success).toEqual(false)
      })
    })
  })
})
