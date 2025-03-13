import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import {
  SimilarSearchDetailedResponse,
  SimilarSearchResponse,
  similarSearchDetailedResponseSchema,
  similarSearchResponseSchema,
} from '../../helpers/types/track'
import { QueryByAudioFile } from './byAudioFile'
import { QueryByAudioFileHash } from './byAudioFileHash'
import { QueryByFileUrl } from './byFileUrl'
import { QueryById } from './byId'
import { QueryByIds } from './byIds'
import { QueryByTag } from './byTag'
import { QueryByText } from './byText'
import { QueryByTextHash } from './byTextHash'
import { QueryByUrl } from './byUrl'

type Request = (
  | QueryById
  | QueryByIds
  | QueryByAudioFile
  | QueryByAudioFileHash
  | QueryByUrl
  | QueryByFileUrl
  | QueryByText
  | QueryByTextHash
  | QueryByTag
) &
  Filtering &
  QueryParams

export const query = async (
  client: () => AxiosInstance,
  path: string,
  data: Request | FormData,
  detailed?: boolean,
): Promise<Response<SimilarSearchResponse | SimilarSearchDetailedResponse>> => {
  try {
    const response = await client().post(`/${API_VERSION}/query/${path}`, data)
    const responseSchema =
      (!(data instanceof FormData) && data?.detailed) || detailed
        ? similarSearchDetailedResponseSchema
        : similarSearchResponseSchema

    const parserResponse = responseSchema.parse(response.data)
    const hash = response.headers['x-hash']

    return successResponse({ ...parserResponse, hash })
  } catch (error) {
    return parseError(error)
  }
}
