import { describe, expect, test, beforeAll } from '@jest/globals'
import { Client } from '../../src/client'

describe('Query endpoints', () => {
  let testClient: Client

  beforeAll(() => {
    testClient = new Client({
      authorization: process.env.TEST_SECRET_TOKEN ?? '',
    })
  })

  test('QueryByUrl', async () => {
    const response = await testClient.endpoints.query.byUrl({ link: 'https://youtu.be/D8K90hX4PrE' })

    expect(response).toMatchObject({
      success: true,
    })
  })

  test('QueryByFileUrl, valid file', async () => {
    const response = await testClient.endpoints.query.byFileUrl({
      track: 'https://download.samplelib.com/mp3/sample-3s.mp3',
    })

    expect(response).toMatchObject({
      success: true,
    })
  })

  test('QueryByAudioFile', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await testClient.endpoints.query.byAudioFile({ track: {} as any })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test('QueryByAudioFileHash', async () => {
    const response = await testClient.endpoints.query.byAudioFileHash({ hash: '123' })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test('QueryByText', async () => {
    const response = await testClient.endpoints.query.byText({ text: 'rainbow' })

    expect(response).toMatchObject({
      success: true,
    })
  })

  test('QueryByTextHash', async () => {
    const response = await testClient.endpoints.query.byTextHash({ hash: '123' })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test('QueryById', async () => {
    const response = await testClient.endpoints.query.byId({ track_id: '' })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test('QueryByIds', async () => {
    const response = await testClient.endpoints.query.byIds({ track_ids: [] })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test('QueryByTag', async () => {
    const response = await testClient.endpoints.query.byTag({ tag_id: 0 })

    expect(response).toMatchObject({
      success: false,
    })
  })

  test
})
