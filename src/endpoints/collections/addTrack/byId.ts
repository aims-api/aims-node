import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { parseError, successResponse, Response } from '../../../helpers/apiResponse'
import { MessageResponse, messageResponseSchema } from '../../../helpers/types'

// ANNOUNC: both interfaces are used only by /src/client/index.ts endpoints

export interface ById {
  track_id: string
  collection_key: string
  track_ids?: never
}

export interface ByIds {
  track_id?: never
  collection_key: string
  track_ids: Array<string>
}

export const addTrackToCollectionById =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (request: ById | ByIds): Promise<Response<MessageResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/${path}/add-track/by-id`, request)
      const parserResponse = messageResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
