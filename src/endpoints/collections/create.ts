import { AxiosInstance } from 'axios'
import { CollectionResponse, collectionResponseSchema } from '../../helpers/types/collection'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface CreateRequest {
  title: string
  key: string
  description?: string
  track_ids?: Array<string>
  user_id?: string
}

export const createCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (request: CreateRequest): Promise<Response<CollectionResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/${path}`, request)
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
