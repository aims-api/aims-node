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

    const response = await testClient.endpoints.search({ query: 'joyful sunny day' })

    expect(response).toMatchObject({
      success: true,
    })
  })
})
