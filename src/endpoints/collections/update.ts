import { ReadStream } from 'node:fs'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { CollectionResponse, collectionResponseSchema } from '../../helpers/types/collection'
import { transformObjToFormData } from '../../helpers/utils'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface UpdateCollection {
  id: string
  data: {
    title: string
    description?: string
    image?: ReadStream | string
  }
}

export const updateCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag', by: 'by-key' | 'by-id') =>
  async (request: UpdateCollection): Promise<Response<CollectionResponse>> => {
    try {
      const isImageUploaded = request.data?.image instanceof ReadStream
      let payload: UpdateCollection['data'] | FormData = request.data

      if (isImageUploaded) {
        const data = new FormData()
        transformObjToFormData(data, request.data)
        payload = data
      }

      const response = await client().post(
        `/${API_VERSION}/${path}/update/${by}/${request.id}`,
        payload,
        isImageUploaded
          ? {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          : undefined,
      )
      const parserResponse = collectionResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
