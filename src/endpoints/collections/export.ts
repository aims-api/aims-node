import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import { AxiosError } from 'axios'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface ExportCollection {
  id: string
}

export const exportCollection =
  (client: () => AxiosInstance, path: 'project', by: 'by-key' | 'by-id') =>
  async (request: ExportCollection): Promise<Response<any>> => {
    try {
      await client().post(`/${API_VERSION}/${path}/export/${by}/${request.id}`)
      return successResponse(undefined)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        // case: collection already exported
        return successResponse(undefined)
      }
      return parseError(error)
    }
  }
