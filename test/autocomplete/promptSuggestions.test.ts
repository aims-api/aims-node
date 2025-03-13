import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { ZodError } from 'zod'
import { API_HOST, API_VERSION } from '../../src/consts'

import { AutocompleteResponse } from '../../src/helpers/types/search'
import { testClient } from './../helpers'

const responseData: AutocompleteResponse = {
  suggestions: [{ value: 'medieval knight fight', type: 'prompt', field: 'field', id: 'id', multiple: true }],
  totals: {
    tags: { value: 100, relation: 'gte' },
  },
}

const emptyResultsData = {
  suggestions: null,
  totals: {
    tags: { value: 0 },
    tracks: { value: 0 },
  },
}

const path = `${API_HOST}/${API_VERSION}/prompt-suggestions`

const server = setupServer(rest.post(path, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number, emptyResults = false) => {
  if (emptyResults) {
    server.use(rest.post(path, (req, res, ctx) => res(ctx.status(status), ctx.json(emptyResultsData))))
    return
  }
  server.use(rest.post(path, (req, res, ctx) => res(ctx.status(status), ctx.json(responseData))))
}

describe('Prompt suggestions', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('success, return data', async () => {
    mockServerBodyData(200)
    const response = await testClient.endpoints.promptSuggestions('test')
    expect(response).toEqual({
      success: true,
      data: responseData,
    })
  })

  test('success, return empty results', async () => {
    mockServerBodyData(200, true)
    const response = await testClient.endpoints.promptSuggestions('test')
    expect(response).toEqual({
      success: true,
      data: { ...emptyResultsData, suggestions: [] },
    })
  })

  test('failure, zod response error', async () => {
    const response = await testClient.endpoints.promptSuggestions('test')
    expect(response.success).toEqual(false)
    // @ts-expect-error error is present because success is false
    expect(response?.error instanceof ZodError).toEqual(true)
  })

  test('failure, axios error', async () => {
    mockServerBodyData(401)
    const response = await testClient.endpoints.promptSuggestions('test')
    expect(response.success).toEqual(false)
  })
})
