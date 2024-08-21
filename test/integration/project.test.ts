import { describe, expect, test, beforeAll } from '@jest/globals'
import { Client } from '../../src/client'

describe('Project manipulation', () => {
  let testClient: Client
  const projectKey = `pipeline-test-${Date.now()}`

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

  test('get tracks of collection, success', async () => {
    const response = await testClient.endpoints.project.getTracks.byKey({ id: projectKey })

    expect(response).toMatchObject({
      success: true,
      data: expect.objectContaining({
        tracks: expect.any(Array),
      }),
    })
  })

  test('delete track from project', async () => {
    const response = await testClient.endpoints.project.removeTrack({
      track_id: 'https://download.samplelib.com/mp3/sample-3s.mp3',
      collection_key: projectKey,
    })

    expect(response.success).toStrictEqual(true)
  })

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
