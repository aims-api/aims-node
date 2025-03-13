import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import { CollectionResponse, collectionResponseSchema } from '../../../helpers/types/collection'

export type CreatePlaylistRequest = {
  user_id: string
  project_id?: string
  project_key?: string
  title?: string
  description?: string
  is_hidden?: boolean
}

export const createPlaylistFromProject =
  (client: () => AxiosInstance, by: 'by-key' | 'by-id') =>
  async (request: CreatePlaylistRequest): Promise<Response<CollectionResponse>> => {
    try {
      const projectIdentifier = request.project_id ? request.project_id : request.project_key
      const response = await client().post(
        `/${API_VERSION}/project/create-playlist/${by}/${projectIdentifier}`,
        request,
        {
          headers: { 'X-User-Id': request.user_id },
        },
      )
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
