import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client'

describe('Artist endpoints', () => {
  test('get artist by title', async () => {
    const testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })

    const response = await testClient.endpoints.artist.get.byTitle({ title: '' })

    expect(response.success).toStrictEqual(false)
  })
})
