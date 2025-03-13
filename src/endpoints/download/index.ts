import { AxiosInstance } from 'axios'
import { z } from 'zod'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'

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
