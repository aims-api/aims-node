import { AxiosInstance } from 'axios'
import {
  CollectionResponse,
  collectionResponseSchema,
} from '../../helpers/types/collection'
import { API_VERSION } from '../../consts'
import {
  parseError,
  successResponse,
  Response,
} from '../../helpers/apiResponse'
import { ReadStream } from 'fs'
import FormData from 'form-data'
import { transformObjToFormData } from '../../helpers/utils'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface CreateRequest {
  title: string
  key: string
  description?: string
  track_ids?: Array<string>
  user_id?: string
  image?: string | ReadStream
}

export const createCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (request: CreateRequest): Promise<Response<CollectionResponse>> => {
    try {
      const isImageUploaded = request?.image instanceof ReadStream
      let payload: CreateRequest | FormData = request

      if (isImageUploaded) {
        const data = new FormData()
        transformObjToFormData(data, request)
        payload = data
      }
      
      const response = await client().post(`/${API_VERSION}/${path}`, payload)
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
