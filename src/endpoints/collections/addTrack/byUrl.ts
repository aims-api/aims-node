import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { parseError, successResponse, Response } from '../../../helpers/apiResponse'
import { MessageResponse, messageResponseSchema } from '../../../helpers/types'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface ByUrl {
  link: string
  collection_key: string
}

export const addTrackToCollectionByUrl =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (request: ByUrl): Promise<Response<MessageResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/${path}/add-track/by-url`, request)
      const parserResponse = messageResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
