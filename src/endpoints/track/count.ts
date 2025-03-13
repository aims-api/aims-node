import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { CountResponse, countResponseSchema } from '../../helpers/types'

const countTracks = (client: () => AxiosInstance) => async (): Promise<Response<CountResponse>> => {
  try {
    const response = await client().get(`/${API_VERSION}/tracks/length`)
    const parserResponse = countResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}

export { countTracks }
