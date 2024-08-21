import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client'

describe('Search endpoint', () => {
  test('Unified search', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
    const response = await testClient.endpoints.search({ query: 'gondolas in venice' })
    expect(response.success).toEqual(false)
  })
})
