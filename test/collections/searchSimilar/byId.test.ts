import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { ZodError } from 'zod'

import { testClient } from '../../helpers'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SimilarCollectionsResponse } from '../../../src/helpers/types/collection'

const responseDataArtists: SimilarCollectionsResponse = {
  query_id: 'query-artists',
  collections: [
    {
      id: 'collections-by-key',
      key: '123',
      processed_at: '2021-09-24T11:45:37.000000Z',
      updated_at: '2021-09-24T11:45:37.000000Z',
      title: 'Hot Summer Time',
    },
  ],
}

const responseDataAlbums: SimilarCollectionsResponse = {
  query_id: 'query-albums',
  collections: [
    {
      id: 'collections-by-key',
      key: '123',
      processed_at: '2021-09-24T11:45:37.000000Z',
      updated_at: '2021-09-24T11:45:37.000000Z',
      title: 'Hot Summer Time',
    },
  ],
}

const responseDataPlaylist: SimilarCollectionsResponse = {
  query_id: 'query-playlist',
  collections: [
    {
      id: 'collections-by-key',
      key: '123',
      processed_at: '2021-09-24T11:45:37.000000Z',
      updated_at: '2021-09-24T11:45:37.000000Z',
      title: 'Hot Summer Time',
    },
  ],
}

const pathArtists = `${API_HOST}/${API_VERSION}/artists/similar/by-id`
const pathAlbums = `${API_HOST}/${API_VERSION}/albums/similar/by-id`
const pathPlaylist = `${API_HOST}/${API_VERSION}/playlist/similar/by-id`

const server = setupServer(
  rest.post(pathArtists, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathAlbums, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathPlaylist, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(pathArtists, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataArtists))),
    rest.post(pathAlbums, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataAlbums))),
    rest.post(pathPlaylist, (req, res, ctx) => res(ctx.status(status), ctx.json(responseDataPlaylist))),
  )
}

describe('Search similar by id', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Artists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.artist.searchSimilar.byId({
        data: {
          id: '123',
          group_id: 'group_id',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataArtists,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.artist.searchSimilar.byId({
        data: {
          id: '123',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.artist.searchSimilar.byId({
        data: {
          id: '123',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Albums', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.album.searchSimilar.byId({
        data: {
          id: '123',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataAlbums,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.album.searchSimilar.byId({
        data: {
          id: '123',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.album.searchSimilar.byId({
        data: {
          id: '123',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Playlist', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.searchSimilar.byId({
        data: {
          id: '123',
        },
        params: {
          page: 1,
          page_size: 5,
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataPlaylist,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.searchSimilar.byId({
        data: {
          id: '123',
        },
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.searchSimilar.byId({
        data: {
          id: '123',
        },
      })
      expect(response.success).toEqual(false)
    })
  })
})
