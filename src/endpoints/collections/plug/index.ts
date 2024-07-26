import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { parseError, Response, successResponse } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse, similarCollectionsResponseSchema } from '../../../helpers/types/collection'
import { ById } from './byId'
import { ByUrl } from './byUrl'
import { ByFileUrl } from './byFileUrl'
import FormData from 'form-data'

export const plug = async (
  client: () => AxiosInstance,
  path: string,
  by: string,
  request: ById | ByUrl | ByFileUrl | FormData,
): Promise<Response<SimilarCollectionsResponse>> => {
  try {
    const response = await client().post(`/${API_VERSION}/${path}/plug/${by}`, request)
    const parserResponse = similarCollectionsResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}
