import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import {
  TrackDetailedResponse,
  trackDetailedResponseSchema,
  TrackResponse,
  trackResponseSchema,
} from '../../helpers/types/track'
import { ByClientId, BySystemId, QueryParams } from '../../helpers/types'

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
