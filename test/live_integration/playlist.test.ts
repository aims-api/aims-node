import { describe, expect, test, beforeAll } from '@jest/globals'
import { Client } from '../../src/client'
//import type { TrackListResponse } from '../../src/helpers/types/track'

describe('Playlist endpoints', () => {
  let testClient: Client
  const playlistKey = `pipeline-test-${Date.now()}`
  // let tracks: TrackListResponse['tracks']

  beforeAll(() => {
    testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
  })

  test('create a playlist', async () => {
    const response = await testClient.endpoints.playlist.create({
      title: 'pipeline-test',
      key: playlistKey,
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        collection: expect.objectContaining({
          title: 'pipeline-test',
          key: playlistKey,
        }),
      },
    })
  })

  test('add track to playlist', async () => {
    const response = await testClient.endpoints.playlist.addTrack.byFileUrl({
      track: 'https://download.samplelib.com/mp3/sample-3s.mp3',
      collection_key: playlistKey,
    })

    expect(response.success).toStrictEqual(true)
  })

  // TDOD: fix
  // test('get tracks of playlist, success', async () => {
  //   const response = await testClient.endpoints.playlist.getTracks.byKey({ id: playlistKey })
  //   tracks = 'data' in response ? (response.data instanceof Error ? [] : response.data.tracks) : []
  //
  //   expect(response.success).toStrictEqual(true)
  //   expect(tracks.length).toStrictEqual(1)
  // })

  test('suggest tracks', async () => {
    const response = await testClient.endpoints.playlist.suggest.byKey({ id: playlistKey })

    expect(response.success).toStrictEqual(false)

    // success: false,
    // error: {
    //   code: 1001,
    //   message: 'This functionality is currently not available. Please try again later!',
    //   payload: []
    // }
    // expect(response).toMatchObject({
    //   success: true,
    //   data: expect.objectContaining({
    //     tracks: expect.any(Array),
    //   }),
    // })
  })

  test('search similar playlists', async () => {
    const response = await testClient.endpoints.playlist.searchSimilar.byKey({ data: { key: playlistKey } })

    expect(response.success).toStrictEqual(false)

    // success: false,
    // error: {
    //   code: 1001,
    //   message: 'This functionality is currently not available. Please try again later!',
    //   payload: []
    // }
    // expect(response).toMatchObject({
    //   success: true,
    //   data: expect.objectContaining({
    //     collections: expect.any(Array),
    //   }),
    // })
  })

  test('plug a playlist, fails', async () => {
    const response = await testClient.endpoints.playlist.plug.byId({ track_id: '' })

    expect(response.success).toStrictEqual(false)
  })

  // TDOD: fix
  // test('delete track from playlist', async () => {
  //   const response = await testClient.endpoints.playlist.removeTrack({
  //     track_id: tracks.length > 0 && tracks[0] !== undefined ? tracks[0].id_client : '',
  //     collection_key: playlistKey,
  //   })
  //
  //   expect(response.success).toStrictEqual(true)
  // })

  test('delete a playlist', async () => {
    const response = await testClient.endpoints.playlist.delete.byKey(playlistKey)

    expect(response).toMatchObject({
      success: true,
      data: {
        message: expect.any(String),
      },
    })
  })
})
