import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { TrackListResponse, trackListResponseSchema } from '../../helpers/types/track'

type Request = {
  page?: number
  page_size?: number
}

const listTracks =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<TrackListResponse>> => {
    try {
      const response = await client().get(`/${API_VERSION}/tracks`, { params: request })
      const parserResponse = trackListResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { listTracks }
