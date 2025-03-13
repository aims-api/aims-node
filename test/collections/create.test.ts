import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../src/consts'
import { CollectionResponse } from '../../src/helpers/types/collection'
import { testClient } from '../helpers'

const responseDataProjects: CollectionResponse = {
  collection: {
    id: 'col-projects',
    key: 'key-projects',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-projects',
  },
}

const responseDataPlaylists: CollectionResponse = {
  collection: {
    id: 'col-playlists',
    key: 'key-playlists',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-playlists',
  },
}

const responseDataCustomTags: CollectionResponse = {
  collection: {
    id: 'col-custom-tags',
    key: 'key-playlists',
    processed_at: null,
    updated_at: 'updated_at',
    title: 'title-playlists',
  },
}

const pathProjects = `${API_HOST}/${API_VERSION}/project`
const pathPlaylists = `${API_HOST}/${API_VERSION}/playlist`
const pathCustomTags = `${API_HOST}/${API_VERSION}/custom-tag`

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

describe('Collections - create', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.project.create({
        title: 'test title',
        key: 'cinema-magazine-175',
        track_ids: [],
      })
      expect(response).toEqual({
        success: true,
        data: responseDataProjects,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.project.create({
        title: 'test title',
        key: 'cinema-magazine-175',
        track_ids: [],
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.project.create({
        title: 'test title',
        key: 'cinema-magazine-175',
        track_ids: [],
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.create({
        title: 'test title',
        key: 'playlist-key',
        track_ids: [],
      })
      expect(response).toEqual({
        success: true,
        data: responseDataPlaylists,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.create({
        title: 'test title',
        key: 'playlist-key',
        track_ids: [],
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.create({
        title: 'test title',
        key: 'playlist-key',
        track_ids: [],
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Custom tags', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.customTag.create({
        title: 'test title',
        key: 'playlist-key',
        track_ids: [],
      })
      expect(response).toEqual({
        success: true,
        data: responseDataCustomTags,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.customTag.create({
        title: 'test title',
        key: 'playlist-key',
        track_ids: [],
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.customTag.create({
        title: 'test title',
        key: 'playlist-key',
        track_ids: [],
      })
      expect(response.success).toEqual(false)
    })
  })
})
