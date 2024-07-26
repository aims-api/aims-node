import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import { SimilarSearchResponse, similarSearchResponseSchema } from '../../helpers/types/track'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface ByKey {
  key: string
  id?: never
  page?: number
  page_size?: number
  group_id?: string
}

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface ById {
  id: string
  key?: never
  page?: number
  page_size?: number
  group_id?: string
}

export const suggestTracks =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag', by: 'by-key' | 'by-id') =>
  async (request: ByKey | ById): Promise<Response<SimilarSearchResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/${path}/suggest/${by}`, request)
      const parserResponse = similarSearchResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
