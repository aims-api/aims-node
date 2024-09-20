import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import { SimilarSearchResponse, similarSearchResponseSchema } from '../../helpers/types/track'
import { Filtering } from '../../helpers/filtering'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export type ByKey = {
  key: string
  id?: never
  page?: number
  page_size?: number
  group_id?: string
} & Filtering

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export type ById = {
  id: string
  key?: never
  page?: number
  page_size?: number
  group_id?: string
} & Filtering

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
