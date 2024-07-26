import { describe, expect, test, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { API_HOST, API_VERSION } from '../../src/consts'
import { ZodError } from 'zod'

import { TrackDetailedResponse, TrackResponse } from '../../src/helpers/types/track'
import fs from 'fs'
import path from 'path'
import { getFormData } from '../../src/endpoints/track/create'
import { checkFormDataValue, testClient } from '../helpers'
import { generalTrackProps, trackDetails } from '../dataMocks'

const responseDataDetailed: TrackDetailedResponse = {
  track: {
    id: 1,
    track_name: 'track by-system-id-detailed',
    ...generalTrackProps,
    ...trackDetails,
  },
}

const responseData: TrackResponse = {
  track: {
    id: 2,
    track_name: 'track by-client-id',
    ...generalTrackProps,
  },
}

const addNewTrackPath = `${API_HOST}/${API_VERSION}/tracks`

const server = setupServer(rest.post(addNewTrackPath, (req, res, ctx) => res(ctx.json({}))))

const mockServerBodyData = (status: number) => {
  server.use(
    rest.post(addNewTrackPath, (req, res, ctx) => {
      if (req.url.searchParams.get('detailed') === 'true') {
        return res(ctx.status(status), ctx.json(responseDataDetailed))
      }
      return res(ctx.status(status), ctx.json(responseData))
    }),
  )
}

describe('createTrack', () => {
  test('getFormData', async () => {
    const formData = getFormData({
      track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
      id_client: 'test_id_of_client',
      track_name: 'test_track_name',
      data: {
        filepath: 'test_file_path',
        active: true,
      },
      params: {
        detailed: true,
      },
    })
    // @ts-expect-error wrong types
    const streams = formData?._streams
    expect(checkFormDataValue(streams, 'track')).toBe(true)
    expect(checkFormDataValue(streams, 'id_client')).toBe(true)
    expect(checkFormDataValue(streams, 'test_id_of_client')).toBe(true)
    expect(checkFormDataValue(streams, 'track_name')).toBe(true)
    expect(checkFormDataValue(streams, 'test_track_name')).toBe(true)
    expect(checkFormDataValue(streams, 'filepath')).toBe(true)
    expect(checkFormDataValue(streams, 'test_file_path')).toBe(true)
    expect(checkFormDataValue(streams, 'active')).toBe(true)
    expect(checkFormDataValue(streams, 'true')).toBe(true)
    expect(checkFormDataValue(streams, 'detailed')).toBe(false)
  })

  describe('create', () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('success, return data, not detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.create({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        id_client: 'ltnsb23dsPddI_2023-08-08T11:58:10.916Z',
        track_name: 'test_name',
        data: {
          filepath: 'filepath',
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseData,
      })
    })

    test('success, return data, detailed', async () => {
      mockServerBodyData(200)
      const response = await testClient.endpoints.track.create({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        id_client: 'ltnsb23dsPddI_2023-08-08T11:58:10.916Z',
        track_name: 'test_name',
        params: {
          detailed: true,
        },
        data: {
          filepath: 'filepath',
        },
      })
      expect(response).toEqual({
        success: true,
        data: responseDataDetailed,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.track.create({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        id_client: 'ltnsb23dsPddI_2023-08-08T11:58:10.916Z',
        track_name: 'test_name',
        data: {
          filepath: 'filepath',
        },
      })
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.track.create({
        track: fs.createReadStream(path.resolve('test/data/sample.mp3')),
        id_client: 'ltnsb23dsPddI_2023-08-08T11:58:10.916Z',
        track_name: 'test_name',
        data: {
          filepath: 'filepath',
        },
      })
      expect(response.success).toEqual(false)
    })
  })
})
