import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { MessageResponse, messageResponseSchema } from '../../helpers/types'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface DeleteTrack {
  track_id: string
  collection_key: string
}

export const deleteTrackFromCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (request: DeleteTrack): Promise<Response<MessageResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/${path}/remove-track/by-id`, request)
      const parserResponse = messageResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
