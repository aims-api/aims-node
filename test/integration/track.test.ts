import { describe, expect, it, beforeAll } from '@jest/globals'
import { Client } from '../../src/client'

describe('Track endpoints', () => {
  let client: Client

  beforeAll(() => {
    client = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
  })

  describe('get', () => {
    it('should return a track by ID', async () => {
      const response = await client.endpoints.track.get({ client_id: '' })
      expect(response.success).toBe(false)
    })
  })

  // Announcement: create endpoint is tested via msw in test/track/create.test.ts

  describe('delete', () => {
    it('should delete a track by ID', async () => {
      const response = await client.endpoints.track.delete({ client_id: '' })
      expect(response.success).toBe(false)
    })
  })
})
