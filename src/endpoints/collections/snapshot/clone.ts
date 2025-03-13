import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import { CollectionResponse, collectionResponseSchema } from '../../../helpers/types/collection'

export type CloneSnapshotRequest = {
  key: string
  snapshot_id: string
  user_id: string
}

export const cloneSnapshot =
  (client: () => AxiosInstance) =>
  async (request: CloneSnapshotRequest): Promise<Response<CollectionResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/project/clone`, request)
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
