import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { testClient } from '../../helpers'
import { responseCustomTag, responsePlaylist, responseProject } from './dataMocks'

const pathProject = `${API_HOST}/${API_VERSION}/project/add-track/by-url`
const pathPlaylist = `${API_HOST}/${API_VERSION}/playlist/add-track/by-url`
const pathCustomTag = `${API_HOST}/${API_VERSION}/custom-tag/add-track/by-url`

const server = setupServer(
  rest.post(pathProject, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathPlaylist, (req, res, ctx) => res(ctx.json([]))),
  rest.post(pathCustomTag, (req, res, ctx) => res(ctx.json([]))),
)

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(pathProject, (req, res, ctx) => res(ctx.status(status), ctx.json(responseProject))),
    rest.post(pathPlaylist, (req, res, ctx) => res(ctx.status(status), ctx.json(responsePlaylist))),
    rest.post(pathCustomTag, (req, res, ctx) => res(ctx.status(status), ctx.json(responseCustomTag))),
  )
}

describe('Collections - addTrack - byUrl', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.project.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response).toEqual({
        success: true,
        data: responseProject,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.project.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.project.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Playlists', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.playlist.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response).toEqual({
        success: true,
        data: responsePlaylist,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.playlist.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.playlist.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response.success).toEqual(false)
    })
  })

  describe('Custom tags', () => {
    test('success, return data', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.customTag.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response).toEqual({
        success: true,
        data: responseCustomTag,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.customTag.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.customTag.addTrack.byUrl({
        link: 'link',
        collection_key: 'abc',
      })
      expect(response.success).toEqual(false)
    })
  })
})
