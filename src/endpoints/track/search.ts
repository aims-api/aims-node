import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, emptyResultsResponse, parseError, successResponse } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import {
  TrackListDetailedResponse,
  TrackListResponse,
  trackListDetailedResponseSchema,
  trackListResponseSchema,
} from '../../helpers/types/track'

export interface SearchByName {
  name: string
  page?: number
  page_size?: number
}
type Request = SearchByName & QueryParams & Filtering

const searchTracks =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<TrackListResponse | TrackListDetailedResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/tracks/search`, request)
      if (response.status === 204) {
        return successResponse(emptyResultsResponse)
      }
      const responseSchema = request.detailed ? trackListDetailedResponseSchema : trackListResponseSchema
      const parserResponse = responseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { searchTracks }
