import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { ZodError } from 'zod'

import { testClient } from '../../helpers'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SimilarCollectionsResponse } from '../../../src/helpers/types/collection'

const responsePlaylist: SimilarCollectionsResponse = {
  query_id: 'query playlist by file url',
  collections: [],
}

const pathPlaylist = `${API_HOST}/${API_VERSION}/playlist/plug/by-file-url`

const server = setupServer(rest.post(pathPlaylist, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(pathPlaylist, (req, res, ctx) => res(ctx.status(status), ctx.json(responsePlaylist))))
}

describe('Collections - plug - byFileUrl', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.plug.byFileUrl({
        track: 'link',
        page: 5,
        page_size: 10,
      })
      expect(response).toEqual({
        success: true,
        data: responsePlaylist,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.plug.byFileUrl({
        track: 'link',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.plug.byFileUrl({
        track: 'link',
      })
      expect(response.success).toEqual(false)
    })
  })
})
