import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { parseError, Response, successResponse } from '../../../helpers/apiResponse'
import {
  SimilarSearchDetailedResponse,
  similarSearchDetailedResponseSchema,
  SimilarSearchResponse,
  similarSearchResponseSchema,
} from '../../../helpers/types/track'
import FormData from 'form-data'
import { ReadStream } from 'fs'
import { transformObjToFormData } from '../../../helpers/utils'
import { SingleSeedRequest } from './singleSeed'
import { MultipleSeedsRequest } from './multipleSeeds'
import { TransitionRequest } from './transition'

export interface ClientSystem {
  type: 'client' | 'system'
  value: string | number
}

export interface Link {
  type: 'url'
  value: string
  time_offset?: number
  time_limit?: number
}

export interface File {
  type: 'file'
  value: ReadStream
  time_offset?: number
  time_limit?: number
}

export type PlaylistRequest = {
  playlist_length: number
}

export const createPlaylist = async (
  client: () => AxiosInstance,
  path: string,
  request: SingleSeedRequest | MultipleSeedsRequest | TransitionRequest,
): Promise<Response<SimilarSearchResponse | SimilarSearchDetailedResponse>> => {
  try {
    const data = new FormData()
    transformObjToFormData(data, request.data, '')
    if (request.filter !== undefined) {
      transformObjToFormData(data, request.filter, 'filter')
    }
    const response = await client().post(`/${API_VERSION}/playlist/${path}`, data, { params: request?.params })
    const parserResponse = request?.params?.detailed
      ? similarSearchDetailedResponseSchema.parse(response.data)
      : similarSearchResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}
