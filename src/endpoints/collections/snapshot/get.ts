import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import { Snapshot, snapshotSchema } from '../../../helpers/types/collection'

const getSnapshot =
  (client: () => AxiosInstance) =>
  async (id: string): Promise<Response<Snapshot>> => {
    try {
      const response = await client().get(`/${API_VERSION}/snapshot/${id}`)
      const parserResponse = snapshotSchema.parse(response.data.snapshot)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { getSnapshot }
