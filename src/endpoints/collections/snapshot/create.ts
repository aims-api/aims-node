import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { parseError, successResponse, Response } from '../../../helpers/apiResponse'
import z from 'zod'

const responseSchema = z.object({
  id: z.string(),
  message: z.string(),
})

export type CreateSnapshotResponse = z.infer<typeof responseSchema>

export type CreateSnapshotRequest = {
  collection_key: string
  user_id: string
  downloadable: boolean
  metadata: string[]
  streaming_secret: string
}

export const createSnapshot =
  (client: () => AxiosInstance) =>
  async (request: CreateSnapshotRequest): Promise<Response<CreateSnapshotResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/project/create-snapshot/by-key`, request, {
        headers: { 'X-User-Id': request.user_id },
      })
      const parserResponse = responseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
