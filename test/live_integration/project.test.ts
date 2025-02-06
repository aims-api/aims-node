import { describe, expect, test, beforeAll } from '@jest/globals'
import { Client } from '../../src/client'
// import { TrackListResponse } from '../../src/helpers/types/track'

describe('Project endpoints', () => {
  let testClient: Client
  const projectKey = `pipeline-test-${Date.now()}`
  //let tracks: TrackListResponse['tracks']

  beforeAll(() => {
    testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
  })

  test('get tracks of collection, project not found', async () => {
    const response = await testClient.endpoints.project.getTracks.byKey({ id: projectKey })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test('create a project', async () => {
    const response = await testClient.endpoints.project.create({
      title: 'pipeline-test',
      key: projectKey,
      description: 'new project',
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        collection: expect.objectContaining({
          title: 'pipeline-test',
          key: projectKey,
          description: 'new project',
        }),
      },
    })
  })

  test('update a project', async () => {
    const response = await testClient.endpoints.project.update.byKey({
      id: projectKey,
      data: { title: 'pipeline-test-updated', description: 'updated description' },
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        collection: expect.objectContaining({
          title: 'pipeline-test-updated',
          key: projectKey,
          description: 'updated description',
        }),
      },
    })
  })

  test('add track to project', async () => {
    const response = await testClient.endpoints.project.addTrack.byFileUrl({
      track: 'https://download.samplelib.com/mp3/sample-3s.mp3',
      collection_key: projectKey,
    })

    expect(response.success).toStrictEqual(true)
  })

  // test('get tracks of project, success', async () => {
  //   const response = await testClient.endpoints.project.getTracks.byKey({ id: projectKey })
  //   tracks = 'data' in response ? (response.data instanceof Error ? [] : response.data.tracks) : []
  //
  //   expect(response.success).toStrictEqual(true)
  //   expect(tracks.length).toStrictEqual(1)
  // })

  // test('delete track from project', async () => {
  //   const response = await testClient.endpoints.project.removeTrack({
  //     track_id: tracks.length > 0 && tracks[0] !== undefined ? tracks[0].id_client : '',
  //     collection_key: projectKey,
  //   })
  //
  //   expect(response.success).toStrictEqual(true)
  // })

  test('delete a project', async () => {
    const response = await testClient.endpoints.project.delete.byKey(projectKey)

    expect(response).toMatchObject({
      success: true,
      data: {
        message: expect.any(String),
      },
    })
  })
})
