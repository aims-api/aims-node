import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import {
  SimilarSearchDetailedResponse,
  similarSearchDetailedResponseSchema,
  SimilarSearchResponse,
  similarSearchResponseSchema,
} from '../../helpers/types/track'
import FormData from 'form-data'
import { Filtering } from '../../helpers/filtering'
import { QueryById } from './byId'
import { QueryByAudioFile } from './byAudioFile'
import { QueryByIds } from './byIds'
import { QueryByAudioFileHash } from './byAudioFileHash'
import { QueryByUrl } from './byUrl'
import { QueryByFileUrl } from './byFileUrl'
import { QueryByText } from './byText'
import { QueryByTag } from './byTag'
import { QueryParams } from '../../helpers/types'
import { QueryByTextHash } from './byTextHash'

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
