import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { Snapshot } from '../../../src/helpers/types/collection'
import { generalTrackProps, trackDetails } from '../../dataMocks'
import { testClient } from '../../helpers'

const getProjectSnapshotResponse: { snapshot: Snapshot } = {
  snapshot: {
    id: 'test-snapshot-id',
    title: 'žřtertwč',
    created_at: '2024-03-11T13:40:48.000000Z',
    number_of_tracks: null,
    tracks: [
      {
        id: 1,
        track_name: 'track',
        ...trackDetails,
        ...generalTrackProps,
      },
    ],
    metadata: [
      'trackName',
      'duration',
      'artists',
      'composers',
      'albumName',
      'publisher',
      'labelName',
      'labelCode',
      'releaseYear',
      'trackNumber',
      'trackCode',
      'bpm',
      'genres',
      'instruments',
      'moods',
      'vocals',
      'albumName',
      'isrc',
      'trackDescription',
    ],
    streaming_secret: 'streaming_secret',
    downloadable: false,
  },
}

const path = `${API_HOST}/${API_VERSION}/snapshot/${getProjectSnapshotResponse.snapshot.id}`

const server = setupServer(rest.get(path, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.get(path, (req, res, ctx) => res(ctx.status(status), ctx.json(getProjectSnapshotResponse))))
}

describe('Get snapshot', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.project.snapshot.get(getProjectSnapshotResponse.snapshot.id)
    expect(response).toEqual({
      success: true,
      data: getProjectSnapshotResponse.snapshot,
    })
  })

  test('failure, zod error', async () => {
    const response = await testClient.endpoints.project.snapshot.get(getProjectSnapshotResponse.snapshot.id)
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.project.snapshot.get(getProjectSnapshotResponse.snapshot.id)
    expect(response.success).toEqual(false)
  })
})
