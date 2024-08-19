import { describe, expect, test, beforeAll } from '@jest/globals'
import { Client } from '../../src/client'

describe('Autocomplete endpoint', () => {
  test('success, returns data', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    const response = await testClient.endpoints.autocomplete('test')

    expect(response).toMatchObject({
      success: true,
    })
  })
})

describe('Query byUrl endpoint', () => {
  test('success, returns data', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    const response = await testClient.endpoints.query.byUrl({ link: 'https://youtu.be/D8K90hX4PrE' })

    expect(response).toMatchObject({
      success: true,
    })
  })
})

describe('Query byAudioFile endpoint', () => {
  test('error, file not provided', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await testClient.endpoints.query.byAudioFile({ track: {} as any })

    expect(response).toMatchObject({
      success: false,
    })
  })
})

describe('Unified search endpoint', () => {
  test('success, returns data', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    const response = await testClient.endpoints.search({ query: 'gondolas in venice' })

    expect(response).toMatchObject({
      success: true,
    })
  })
})

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

  test('get tracks of collection, success', async () => {
    const response = await testClient.endpoints.project.getTracks.byKey({ id: projectKey })

    expect(response).toMatchObject({
      success: true,
      data: expect.objectContaining({
        tracks: expect.any(Array),
      }),
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
