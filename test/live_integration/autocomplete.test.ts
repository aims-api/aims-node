import { describe, expect, test } from '@jest/globals'
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
