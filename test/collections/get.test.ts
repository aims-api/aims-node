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

const albumById: CollectionResponse = {
  collection: {
    id: 'album-id',
    key: 'key-album',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-album',
  },
}

const albumByKey: CollectionResponse = {
  collection: {
    id: 'album-key',
    key: 'key-album',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-album',
  },
}

const artistById: CollectionResponse = {
  collection: {
    id: 'artist-id',
    key: 'key-artist',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-artist',
  },
}

const artistByKey: CollectionResponse = {
  collection: {
    id: 'artist-key',
    key: 'key-artist',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-artist',
  },
}

const pathProjectById = `${API_HOST}/${API_VERSION}/project/get/by-id/project-id`
const pathProjectByKey = `${API_HOST}/${API_VERSION}/project/get/by-key/project-key`
const pathPlaylistById = `${API_HOST}/${API_VERSION}/playlist/get/by-id/playlist-id`
const pathPlaylistByKey = `${API_HOST}/${API_VERSION}/playlist/get/by-key/playlist-key`
const pathCustomTagById = `${API_HOST}/${API_VERSION}/custom-tag/get/by-id/custom-tag-id`
const pathCustomTagByKey = `${API_HOST}/${API_VERSION}/custom-tag/get/by-key/custom-tag-key`
const pathAlbumTagById = `${API_HOST}/${API_VERSION}/albums/get/by-id/album-id`
const pathAlbumTagByKey = `${API_HOST}/${API_VERSION}/albums/get/by-key/album-key`
const pathArtistTagById = `${API_HOST}/${API_VERSION}/artists/get/by-id/artist-id`
const pathArtistTagByKey = `${API_HOST}/${API_VERSION}/artists/get/by-key/artist-key`

const server = setupServer(
  rest.get(pathProjectById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathProjectByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathPlaylistById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathPlaylistByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathCustomTagById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathCustomTagByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathAlbumTagById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathAlbumTagByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathArtistTagById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathArtistTagByKey, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.get(pathProjectById, (req, res, ctx) => res(ctx.status(status), ctx.json(projectById))),
    rest.get(pathProjectByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(projectByKey))),
    rest.get(pathPlaylistById, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistById))),
    rest.get(pathPlaylistByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistByKey))),
    rest.get(pathCustomTagById, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagById))),
    rest.get(pathCustomTagByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagByKey))),
    rest.get(pathAlbumTagById, (req, res, ctx) => res(ctx.status(status), ctx.json(albumById))),
    rest.get(pathAlbumTagByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(albumByKey))),
    rest.get(pathArtistTagById, (req, res, ctx) => res(ctx.status(status), ctx.json(artistById))),
    rest.get(pathArtistTagByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(artistByKey))),
  )
}

describe('Collections - get', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.get.byKey({
          id: 'project-key',
          params: {
            groups: true,
          },
        })
        expect(response).toEqual({
          success: true,
          data: projectByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.get.byKey({
          id: 'project-key',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.get.byKey({
          id: 'project-key',
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.get.byId({ id: 'project-id' })
        expect(response).toEqual({
          success: true,
          data: projectById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.get.byId({ id: 'project-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.get.byId({ id: 'project-id' })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Playlists', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.get.byKey({ id: 'playlist-key' })
        expect(response).toEqual({
          success: true,
          data: playlistByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.get.byKey({ id: 'playlist-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.get.byKey({ id: 'playlist-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.get.byId({ id: 'playlist-id' })
        expect(response).toEqual({
          success: true,
          data: playlistById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.get.byId({ id: 'playlist-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.get.byId({ id: 'playlist-id' })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Custom tags', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.get.byKey({ id: 'custom-tag-key' })
        expect(response).toEqual({
          success: true,
          data: customTagByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.get.byKey({ id: 'custom-tag-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.get.byKey({ id: 'custom-tag-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.get.byId({ id: 'custom-tag-id' })
        expect(response).toEqual({
          success: true,
          data: customTagById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.get.byId({ id: 'custom-tag-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.get.byId({ id: 'custom-tag-id' })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Albums', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.album.get.byKey({ id: 'album-key' })
        expect(response).toEqual({
          success: true,
          data: albumByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.album.get.byKey({ id: 'album-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.album.get.byKey({ id: 'album-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.album.get.byId({ id: 'album-id' })
        expect(response).toEqual({
          success: true,
          data: albumById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.album.get.byId({ id: 'album-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.album.get.byId({ id: 'album-id' })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Artists', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.artist.get.byKey({ id: 'artist-key' })
        expect(response).toEqual({
          success: true,
          data: artistByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.artist.get.byKey({ id: 'artist-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.artist.get.byKey({ id: 'artist-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.artist.get.byId({ id: 'artist-id' })
        expect(response).toEqual({
          success: true,
          data: artistById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.artist.get.byId({ id: 'artist-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.artist.get.byId({ id: 'artist-id' })
        expect(response.success).toEqual(false)
      })
    })
  })
})
