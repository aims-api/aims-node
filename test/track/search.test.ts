import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../../src/consts'

import { TrackListResponse } from '../../src/helpers/types/track'
import { testClient } from '../helpers'

const trackListResponse: TrackListResponse = {
  tracks: [
    {
      id: 1,
      id_client: 'foo',
      duration: 240,
      release_year: 2010,
      track_name: 'track 1',
      tags: ['foo', 'bar'],
      processed_at: {
        date: '2018',
        timezone_type: 3,
        timezone: 'UTC',
      },
      process_input_error: 'null',
      store_secret: '12bj143bapie213',
    },
    {
      id: 2,
      id_client: 'foo',
      duration: 240,
      release_year: 2009,
      track_name: 'track 2',
      tags: ['foo', 'bar'],
      processed_at: {
        date: '2018',
        timezone_type: 3,
        timezone: 'UTC',
      },
      process_input_error: 'null',
      store_secret: '12bj143bapie213',
    },
  ],
  pagination: {
    page: 3,
    page_size: 10,
    item_count: 123,
    page_count: 321,
  },
}
const querySearchTracksPath = `${API_HOST}/${API_VERSION}/tracks/search`

const server = setupServer(rest.post(querySearchTracksPath, (req, res, ctx) => res(ctx.json({}))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(querySearchTracksPath, (req, res, ctx) => res(ctx.status(status), ctx.json(trackListResponse))))
}

describe('SearchTracks - byName', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.track.search({
      name: 'keyword',
      page: 1,
      page_size: 20,
    })
    expect(response).toEqual({
      success: true,
      data: trackListResponse,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.track.search({
      name: 'keyword',
      page: 1,
      page_size: 20,
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.track.search({
      name: 'keyword',
      page: 1,
      page_size: 20,
    })
    expect(response.success).toEqual(false)
  })
})
