import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import fs from 'node:fs'
import path from 'node:path'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { SimilarCollectionsResponse } from '../../../src/helpers/types/collection'
import { testClient } from '../../helpers'

const responsePlaylist: SimilarCollectionsResponse = {
  query_id: 'query playlist by file',
  collections: [],
}

const pathPlaylist = `${API_HOST}/${API_VERSION}/playlist/plug/by-file`

const server = setupServer(rest.post(pathPlaylist, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(pathPlaylist, (req, res, ctx) => res(ctx.status(status), ctx.json(responsePlaylist))))
}

describe('Collections - plug - byFile', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.plug.byFile({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
      })
      expect(response).toEqual({
        success: true,
        data: responsePlaylist,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.plug.byFile({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.plug.byFile({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
      })
      expect(response.success).toEqual(false)
    })
  })
})
