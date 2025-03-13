import { beforeAll, describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client'

describe('CustomTag endpoints', () => {
  let testClient: Client
  const tagTitle = 'pipeline-test'
  const tagKey = `pipeline-test-${Date.now()}`

  beforeAll(() => {
    testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
  })

  test('create a tag', async () => {
    const response = await testClient.endpoints.customTag.create({ title: tagTitle, key: tagKey })
    expect(response).toMatchObject({
      success: true,
      data: {
        collection: expect.objectContaining({
          title: tagTitle,
          key: tagKey,
        }),
      },
    })
  })

  test('update a tag', async () => {
    const response = await testClient.endpoints.customTag.update.byKey({
      id: tagKey,
      data: { title: 'pipeline-test-updated', description: 'updated description' },
      // Announcement: change of 'description' prop is not supported
    })

    expect(response).toMatchObject({
      success: true,
      data: {
        collection: expect.objectContaining({
          key: tagKey,
          title: 'pipeline-test-updated',
        }),
      },
    })
  })

  test('delete a tag', async () => {
    const response = await testClient.endpoints.customTag.delete.byKey(tagKey)

    expect(response).toMatchObject({
      success: true,
      data: {
        message: expect.any(String),
      },
    })
  })
})
