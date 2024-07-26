import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { testClient } from '../helpers'
import { TrackListResponse } from '../../src/helpers/types/track'

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

const listPath = `${API_HOST}/${API_VERSION}/tracks`

const server = setupServer(rest.get(listPath, (req, res, ctx) => res(ctx.json({}))))

const mockServerBodyData = (status: number) => {
  server.use(rest.get(listPath, (req, res, ctx) => res(ctx.status(status), ctx.json(trackListResponse))))
}

describe('listTracks', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.track.list({
      page: 1,
      page_size: 3,
    })
    expect(response).toEqual({
      success: true,
      data: trackListResponse,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.track.list({
      page: 1,
      page_size: 3,
    })
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.track.list({
      page: 1,
      page_size: 3,
    })
    expect(response.success).toEqual(false)
  })
})
