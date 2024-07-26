import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import { z } from 'zod'

export const downloadByUrlResponseSchema = z.string()

export type DownloadByUrlResponse = z.infer<typeof downloadByUrlResponseSchema>

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface DownloadByUrl {
  link: string
}

const download =
  (client: () => AxiosInstance) =>
  async (data: DownloadByUrl): Promise<Response<DownloadByUrlResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/download/by-url`, data)
      const parserResponse = downloadByUrlResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { download }
