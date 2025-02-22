import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import {
  parseError,
  successResponse,
  Response,
} from '../../helpers/apiResponse'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface ExportCollection {
  id: string
}

export const exportCollection =
  (client: () => AxiosInstance, path: 'project', by: 'by-key' | 'by-id') =>
  async (request: ExportCollection): Promise<Response<undefined>> => {
    try {
      await client().post(`/${API_VERSION}/${path}/export/${by}/${request.id}`)
      return successResponse(undefined)
    } catch (error) {
      return parseError(error)
    }
  }
