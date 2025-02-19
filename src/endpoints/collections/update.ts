import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import { CollectionResponse, collectionResponseSchema } from '../../helpers/types/collection'


// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface UpdateCollection {
  id: string
  data: {
    title: string
    description?: string
  } | FormData
  // ANNOUNC: FormData accepts title, description, image properties.
}

export const updateCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag', by: 'by-key' | 'by-id') =>
  async (request: UpdateCollection): Promise<Response<CollectionResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/${path}/update/${by}/${request.id}`, request.data, request.data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : undefined)
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
