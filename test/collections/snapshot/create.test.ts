import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { ZodError } from 'zod'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_HOST, API_VERSION } from '../../../src/consts'
import { CreateSnapshotRequest, CreateSnapshotResponse } from '../../../src/endpoints/collections/snapshot/create'
import { testClient } from '../../helpers'

const createProjectSnapshotRequest: CreateSnapshotRequest = {
  collection_key: 'test title',
  downloadable: false,
  user_id: 'mr.smith',
  metadata: [],
  streaming_secret: 'secret-hash',
}

const createProjectSnapshotResponse: CreateSnapshotResponse = {
  id: 'sharable-project-snapshot-id',
  message: 'Snapshot has been created.',
}

const path = `${API_HOST}/${API_VERSION}/project/create-snapshot/by-key`

const server = setupServer(rest.post(path, (req, res, ctx) => res(ctx.json([]))))

const mockServerBodyData = (status: number) => {
  server.use(rest.post(path, (req, res, ctx) => res(ctx.status(status), ctx.json(createProjectSnapshotResponse))))
}

describe('Collections - Create snaphost', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Projects', () => {
    test('success, return data', async () => {
      mockServerBodyData(201)
      const response = await testClient.endpoints.project.snapshot.create(createProjectSnapshotRequest)
      expect(response).toEqual({
        success: true,
        data: createProjectSnapshotResponse,
      })
    })

    test('failure, zod error', async () => {
      const response = await testClient.endpoints.project.snapshot.create(createProjectSnapshotRequest)
      expect(response.success).toEqual(false)
      // @ts-expect-error error is present because success is false
      expect(response?.error instanceof ZodError).toEqual(true)
    })

    test('failure, axios error', async () => {
      mockServerBodyData(401)
      const response = await testClient.endpoints.project.snapshot.create(createProjectSnapshotRequest)
      expect(response.success).toEqual(false)
    })
  })
})
