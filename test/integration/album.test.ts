import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client'

describe('Album endpoints', () => {
  test('get albums by id', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    const response = await testClient.endpoints.album.get.byId({ id: '' })
    expect(response.success).toEqual(false)
  })

  test('search similar albums by key', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    const response = await testClient.endpoints.album.searchSimilar.byKey({ data: { key: '' } })
    expect(response.success).toEqual(false)
  })
})
