import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../src/consts'
import { SimilarSearchResponse } from '../../src/helpers/types/track'
import { generalTrackProps } from '../dataMocks'
import { testClient } from '../helpers'

const projectById: SimilarSearchResponse = {
  query_id: 'query project by key',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track project by key',
    },
  ],
}

const projectByKey: SimilarSearchResponse = {
  query_id: 'query project by id',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track project by id',
    },
  ],
}

const playlistById: SimilarSearchResponse = {
  query_id: 'query playlist by id',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track playlist by id',
    },
  ],
}

const playlistByKey: SimilarSearchResponse = {
  query_id: 'query playlist by key',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track playlist by key',
    },
  ],
}

const customTagById: SimilarSearchResponse = {
  query_id: 'query custom tag by id',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track custom tag by id',
    },
  ],
}

const customTagByKey: SimilarSearchResponse = {
  query_id: 'query custom tag by key',
  tracks: [
    {
      ...generalTrackProps,
      id: 1,
      track_name: 'track custom tag by key',
    },
  ],
}

const pathProjectById = `${API_HOST}/${API_VERSION}/project/suggest/by-id`
const pathProjectByKey = `${API_HOST}/${API_VERSION}/project/suggest/by-key`
const pathPlaylistById = `${API_HOST}/${API_VERSION}/playlist/suggest/by-id`
const pathPlaylistByKey = `${API_HOST}/${API_VERSION}/playlist/suggest/by-key`
const pathCustomTagById = `${API_HOST}/${API_VERSION}/custom-tag/suggest/by-id`
const pathCustomTagByKey = `${API_HOST}/${API_VERSION}/custom-tag/suggest/by-key`

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

describe('Collections - suggest', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    describe('byKey', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.suggest.byKey({
          key: 'Test_2023-08-09T09:43:12.831Z',
          page: 5,
          page_size: 10,
          group_id: 'group_id',
        })
        expect(response).toEqual({
          success: true,
          data: projectByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.suggest.byKey({
          key: 'Test_2023-08-09T09:43:12.831Z',
          page: 5,
          page_size: 10,
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.suggest.byKey({
          key: 'Test_2023-08-09T09:43:12.831Z',
          page: 5,
          page_size: 10,
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.project.suggest.byId({
          id: 'project-id',
        })
        expect(response).toEqual({
          success: true,
          data: projectById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.project.suggest.byId({
          id: 'project-id',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.project.suggest.byId({
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
        const response = await testClient.endpoints.playlist.suggest.byKey({
          key: 'playlist-key',
        })
        expect(response).toEqual({
          success: true,
          data: playlistByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.suggest.byKey({
          key: 'playlist-key',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.suggest.byKey({
          key: 'playlist-key',
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.playlist.suggest.byId({
          id: 'playlist-id',
        })
        expect(response).toEqual({
          success: true,
          data: playlistById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.playlist.suggest.byId({
          id: 'playlist-id',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.playlist.suggest.byId({
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
        const response = await testClient.endpoints.customTag.suggest.byKey({
          key: 'key',
        })
        expect(response).toEqual({
          success: true,
          data: customTagByKey,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.suggest.byKey({
          key: 'key',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.suggest.byKey({
          key: 'key',
        })
        expect(response.success).toEqual(false)
      })
    })

    describe('byId', () => {
      test('success, return data', async () => {
        mockServerBodyData(200)
        const response = await testClient.endpoints.customTag.suggest.byId({
          id: 'id',
        })
        expect(response).toEqual({
          success: true,
          data: customTagById,
        })
      })

      test('failure, zod error', async () => {
        const response = await testClient.endpoints.customTag.suggest.byId({
          id: 'id',
        })
        expect(response.success).toEqual(false)
        // @ts-expect-error error is present because success is false
        expect(response?.error instanceof ZodError).toEqual(true)
      })

      test('failure, axios error', async () => {
        mockServerBodyData(401)
        const response = await testClient.endpoints.customTag.suggest.byId({
          id: 'id',
        })
        expect(response.success).toEqual(false)
      })
    })
  })
})
