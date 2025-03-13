import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../src/consts'
import { CollectionsList } from '../../src/helpers/types/collection'
import { testClient } from '../helpers'

const responseDataProjects: CollectionsList = {
  collections: [
    {
      id: 'id-projects',
      updated_at: 'updated_at',
      processed_at: null,
      key: 'key-projects',
      title: 'title-projects',
    },
  ],
  pagination: {
    item_count: 3,
  },
}

const responseDataPlaylists: CollectionsList = {
  collections: [
    {
      id: 'id-playlists',
      updated_at: 'updated_at',
      processed_at: 'processed_at',
      key: 'key-playlists',
      title: 'title-playlists',
    },
  ],
  pagination: {
    item_count: 5,
  },
}

const responseDataCustomTags: CollectionsList = {
  collections: [
    {
      id: 'id-custom-tags',
      updated_at: 'updated_at',
      processed_at: 'processed_at',
      key: 'key-custom-tags',
      title: 'title-custom-tags',
    },
  ],
  pagination: {
    item_count: 5,
  },
}

const pathProjects = `${API_HOST}/${API_VERSION}/project`
const pathPlaylists = `${API_HOST}/${API_VERSION}/playlist`
const pathCustomTags = `${API_HOST}/${API_VERSION}/custom-tag`

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

describe('Collections - list', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.project.list({
        groups: true,
      })
      expect(response).toEqual({
        success: true,
        data: responseDataProjects,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.project.list({
        page: 1,
        page_size: 3,
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.project.list({
        page: 1,
        page_size: 3,
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.list()
      expect(response).toEqual({
        success: true,
        data: responseDataPlaylists,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.list()
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.list()
      expect(response.success).toEqual(false)
    })
  })

  describe('Custom tags', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.customTag.list()
      expect(response).toEqual({
        success: true,
        data: responseDataCustomTags,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.customTag.list()
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.customTag.list()
      expect(response.success).toEqual(false)
    })
  })
})
