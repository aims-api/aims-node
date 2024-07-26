import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import { MessageResponse, messageResponseSchema } from '../../helpers/types'

export const deleteCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag', by: 'by-key' | 'by-id') =>
  async (id: string): Promise<Response<MessageResponse>> => {
    try {
      const response = await client().delete(`/${API_VERSION}/${path}/delete/${by}/${id}`)
      const parserResponse = messageResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
