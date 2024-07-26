import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { API_HOST, API_VERSION } from '../../src/consts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { TrackListDetailedResponse, TrackListResponse } from '../../src/helpers/types/track'
import { generalTrackProps, trackDetails } from '../dataMocks'

const pagination = {
  item_count: 45,
  page: 1,
  page_count: 23,
  page_size: 12,
}

const projectById: TrackListResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track project by id',
      ...generalTrackProps,
    },
  ],
  pagination,
}

const projectByIdDetailed: TrackListDetailedResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track project by id',
      ...generalTrackProps,
      ...trackDetails,
    },
  ],
  pagination,
}

const projectByKey: TrackListResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track project by key',
      ...generalTrackProps,
    },
  ],
  pagination,
}

const playlistById: TrackListResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track playlist by id',
      ...generalTrackProps,
    },
  ],
  pagination,
}

const playlistByKey: TrackListResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track playlist by key',
      ...generalTrackProps,
    },
  ],
  pagination,
}

const customTagById: TrackListResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track custom tag by id',
      ...generalTrackProps,
    },
  ],
  pagination,
}

const customTagByKey: TrackListResponse = {
  tracks: [
    {
      id: 1,
      track_name: 'track custom tag by key',
      ...generalTrackProps,
    },
  ],
  pagination,
}

const pathProjectById = `${API_HOST}/${API_VERSION}/project/get-tracks/by-id/project-id`
const pathProjectByKey = `${API_HOST}/${API_VERSION}/project/get-tracks/by-key/project-key`
const pathPlaylistById = `${API_HOST}/${API_VERSION}/playlist/get-tracks/by-id/playlist-id`
const pathPlaylistByKey = `${API_HOST}/${API_VERSION}/playlist/get-tracks/by-key/playlist-key`
const pathCustomTagById = `${API_HOST}/${API_VERSION}/custom-tag/get-tracks/by-id/playlist-id`
const pathCustomTagByKey = `${API_HOST}/${API_VERSION}/custom-tag/get-tracks/by-key/playlist-key`

const server = setupServer(
  rest.get(pathProjectById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathProjectByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathPlaylistById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathPlaylistByKey, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathCustomTagById, (req, res, ctx) => res(ctx.json([]))),
  rest.get(pathCustomTagByKey, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.get(pathProjectById, (req, res, ctx) =>
      req.url.searchParams.get('detailed') === 'true'
        ? res(ctx.status(status), ctx.json(projectByIdDetailed))
        : res(ctx.status(status), ctx.json(projectById)),
    ),
    rest.get(pathProjectByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(projectByKey))),
    rest.get(pathPlaylistById, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistById))),
    rest.get(pathPlaylistByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(playlistByKey))),
    rest.get(pathCustomTagById, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagById))),
    rest.get(pathCustomTagByKey, (req, res, ctx) => res(ctx.status(status), ctx.json(customTagByKey))),
  )
}

describe('Collections - getTracks', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.getTracks.byKey({ id: 'project-key' })
        expect(response).toEqual({
          success: true,
          data: projectByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.getTracks.byKey({ id: 'project-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.getTracks.byKey({ id: 'project-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.getTracks.byId({ id: 'project-id' })
        expect(response).toEqual({
          success: true,
          data: projectById,
        })
      })
      test('success, return detailed data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.getTracks.byId({
          id: 'project-id',
          params: { detailed: true },
        })
        expect(response).toEqual({
          success: true,
          data: projectByIdDetailed,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.getTracks.byId({ id: 'project-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.getTracks.byId({ id: 'project-id' })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Playlists', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.getTracks.byKey({ id: 'playlist-key' })
        expect(response).toEqual({
          success: true,
          data: playlistByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.getTracks.byKey({ id: 'playlist-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.getTracks.byKey({ id: 'playlist-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.getTracks.byId({ id: 'playlist-id' })
        expect(response).toEqual({
          success: true,
          data: playlistById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.getTracks.byId({ id: 'playlist-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.getTracks.byId({ id: 'playlist-id' })
        expect(response.success).toEqual(false)
      })
    })
  })

  describe('Custom tags', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.getTracks.byKey({ id: 'playlist-key' })
        expect(response).toEqual({
          success: true,
          data: customTagByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.getTracks.byKey({ id: 'playlist-key' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.getTracks.byKey({ id: 'playlist-key' })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.getTracks.byId({ id: 'playlist-id' })
        expect(response).toEqual({
          success: true,
          data: customTagById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.getTracks.byId({ id: 'playlist-id' })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.getTracks.byId({ id: 'playlist-id' })
        expect(response.success).toEqual(false)
      })
    })
  })
})
