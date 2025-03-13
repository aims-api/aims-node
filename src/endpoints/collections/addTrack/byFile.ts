import { ReadStream } from 'node:fs'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import { MessageResponse, messageResponseSchema } from '../../../helpers/types'
import { transformObjToFormData } from '../../../helpers/utils'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints

export interface ByFile {
  track: ReadStream
  collection_key: string
}

export const addTrackToCollectionByFile =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (request: ByFile): Promise<Response<MessageResponse>> => {
    try {
      const data = new FormData()
      transformObjToFormData(data, request)
      const response = await client().post(`/${API_VERSION}/${path}/add-track/by-file`, data)
      const parserResponse = messageResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
