import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { ByClientId, BySystemId, MessageResponse, messageResponseSchema } from '../../helpers/types'

type Request = BySystemId | ByClientId

const callApi = async (client: () => AxiosInstance, path: string, id: string): Promise<Response<MessageResponse>> => {
  try {
    const response = await client().delete(`/${API_VERSION}/tracks/${path}/${id}`)
    const parserResponse = messageResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}

const deleteTrack =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<MessageResponse>> => {
    if ('system_id' in request) {
      return await callApi(client, 'system', request.system_id)
    }
    return await callApi(client, 'client', request.client_id)
  }

export { deleteTrack }
