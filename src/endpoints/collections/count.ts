import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'
import { CountResponse, countResponseSchema } from '../../helpers/types'

// ANNOUNC: this type is exported for /src/client/index.ts endpoints (TS bug?)
export interface CountParams {
  show_hidden?: boolean
  user_id?: string
}

export const countCollections =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (params?: CountParams): Promise<Response<CountResponse>> => {
    try {
      const response = await client().get(`/${API_VERSION}/${path}/length`, {
        params: {
          ...params,
          show_hidden: params?.show_hidden ? 1 : undefined,
        },
      })
      const parserResponse = countResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
