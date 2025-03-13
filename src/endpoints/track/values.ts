import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { TrackListResponse } from '../../helpers/types/track'

type Request = {
  field: string
}

const getValues =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<TrackListResponse>> => {
    try {
      const { field } = request
      const response = await client().get(`/${API_VERSION}/tracks/values/${field}`)
      return successResponse(response.data)
    } catch (error) {
      return parseError(error)
    }
  }

export { getValues }
