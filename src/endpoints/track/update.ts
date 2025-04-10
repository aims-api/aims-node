import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { ByClientId, BySystemId, Metadata, QueryParams } from '../../helpers/types'
import {
  TrackDetailedResponse,
  TrackResponse,
  trackDetailedResponseSchema,
  trackResponseSchema,
} from '../../helpers/types/track'

type Request = (BySystemId | ByClientId) & QueryParams & { data?: Metadata }

const callApi = async (
  client: () => AxiosInstance,
  path: string,
  id: string,
  data: Metadata,
  params: QueryParams,
): Promise<Response<TrackResponse | TrackDetailedResponse>> => {
  try {
    const response = await client().post(`/${API_VERSION}/tracks/${path}/${id}`, data, {
      params,
    })
    const parserResponse = params.detailed
      ? trackDetailedResponseSchema.parse(response.data)
      : trackResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}

const updateTrack =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<TrackResponse | TrackDetailedResponse>> => {
    if ('system_id' in request) {
      return await callApi(client, 'system', request.system_id, request?.data ?? {}, { detailed: request.detailed })
    }
    return await callApi(client, 'client', request.client_id, request?.data ?? {}, { detailed: request.detailed })
  }

export { updateTrack }
