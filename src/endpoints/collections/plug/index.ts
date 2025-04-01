import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse, similarCollectionsResponseSchema, similarCollectionsResponseSchemaDetailed } from '../../../helpers/types/collection'
import { ByFileUrl } from './byFileUrl'
import { ById } from './byId'
import { ByUrl } from './byUrl'

export const plug = async (
  client: () => AxiosInstance,
  path: string,
  by: string,
  request: ById | ByUrl | ByFileUrl | FormData,
): Promise<Response<SimilarCollectionsResponse>> => {
  try {
    const response = await client().post(`/${API_VERSION}/${path}/plug/${by}`, request)
    const detailed = ("detailed" in request && request.detailed) || false
    const parserResponse = (
      detailed ? similarCollectionsResponseSchemaDetailed : similarCollectionsResponseSchema
    ).parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}
