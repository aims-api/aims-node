import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import {
  CollectionResponse,
  collectionResponseSchema,
  CollectionType,
  GetCollection,
} from '../../helpers/types/collection'

export const getCollection =
  (client: () => AxiosInstance, path: CollectionType, by: 'by-key' | 'by-id') =>
  async (request: GetCollection): Promise<Response<CollectionResponse>> => {
    try {
      const response = await client().get(`/${API_VERSION}/${path}/get/${by}/${request.id}`, { params: request.params })
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
