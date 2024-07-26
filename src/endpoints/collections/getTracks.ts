import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response, emptyResultsResponse } from '../../helpers/apiResponse'
import { TrackListResponse, trackListDetailedResponseSchema, trackListResponseSchema } from '../../helpers/types/track'
import { QueryParams } from '../../helpers/types'

export const getTracks =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag' | 'albums', by: 'by-key' | 'by-id') =>
  async ({ id, params }: { id: string; params?: QueryParams }): Promise<Response<TrackListResponse>> => {
    try {
      const response = await client().get(`/${API_VERSION}/${path}/get-tracks/${by}/${id}`, {
        params,
      })

      if (response.status === 204) {
        return successResponse(emptyResultsResponse)
      }

      const parserResponse = (params?.detailed ? trackListDetailedResponseSchema : trackListResponseSchema).parse(
        response.data,
      )
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
