import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import {
  SimilarCollectionsResponse,
  similarCollectionsResponseSchema,
  similarCollectionsResponseSchemaDetailed,
} from '../../../helpers/types/collection'
import { ByFile } from './byFile'
import { ByFileUrl } from './byFileUrl'
import { ById } from './byId'
import { ByUrl } from './byUrl'

// FormData is a stream, so its data cannot be read, but the detailed prop needs to be passed as a param - so we use `options` as a workaround
const getDetailedProp = (request: ById | ByUrl | ByFileUrl | ByFile | FormData, options?: { detailed?: boolean }) => {
  if (options?.detailed) {
    return options.detailed
  }

  if ('detailed' in request && request.detailed) {
    return true
  }

  return false
}

export const plug = async (
  client: () => AxiosInstance,
  path: string,
  by: string,
  request: ById | ByUrl | ByFileUrl | ByFile | FormData,
  options?: { detailed?: boolean },
): Promise<Response<SimilarCollectionsResponse>> => {
  try {
    const detailed = getDetailedProp(request, options)
    const response = await client().post(`/${API_VERSION}/${path}/plug/${by}`, request, { params: { detailed } })
    const parserResponse = (
      detailed ? similarCollectionsResponseSchemaDetailed : similarCollectionsResponseSchema
    ).parse(response.data)
    const hash = response.headers['x-hash']
    return successResponse({ ...parserResponse, ...(hash && { hash }) })
  } catch (error) {
    return parseError(error)
  }
}
