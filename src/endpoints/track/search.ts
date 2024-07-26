import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { emptyResultsResponse, parseError, Response, successResponse } from '../../helpers/apiResponse'
import {
  TrackListDetailedResponse,
  trackListDetailedResponseSchema,
  TrackListResponse,
  trackListResponseSchema,
} from '../../helpers/types/track'
import { QueryParams } from '../../helpers/types'
import { Filtering } from '../../helpers/filtering'

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
      const response = await client().get(`/${API_VERSION}/tracks/search`, { params: request })
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
