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

describe('Create and delete project', () => {
  let testClient: Client
  const projectKey = `pipeline-test-${Date.now()}`

  beforeAll(() => {
    testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
  })

  test('create a project', async () => {
    const response = await testClient.endpoints.project.create({
      title: 'pipeline-test',
      key: projectKey,
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        collection: expect.objectContaining({
          title: 'pipeline-test',
          key: projectKey,
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
