import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { ByClientId, BySystemId, QueryParams } from '../../helpers/types'
import {
  TrackDetailedResponse,
  TrackResponse,
  trackDetailedResponseSchema,
  trackResponseSchema,
} from '../../helpers/types/track'

type Request = (BySystemId | ByClientId) & { params?: QueryParams }

const callApi = async (
  client: () => AxiosInstance,
  path: string,
  id: string,
  params: QueryParams | undefined,
): Promise<Response<TrackResponse | TrackDetailedResponse>> => {
  try {
    const response = await client().get(`/${API_VERSION}/tracks/${path}/${id}`, { params })
    const parserResponse = params?.detailed
      ? trackDetailedResponseSchema.parse(response.data)
      : trackResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}

const getTrack =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<TrackResponse | TrackDetailedResponse>> => {
    if ('system_id' in request) {
      return await callApi(client, 'system', request.system_id, request.params)
    }
    return await callApi(client, 'client', request.client_id, request.params)
  }

export { getTrack }
