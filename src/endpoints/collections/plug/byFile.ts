import { ReadStream } from 'node:fs'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { Response } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { transformObjToFormData } from '../../../helpers/utils'
import { plug } from './index'
import { Filtering } from '../../../helpers/filtering'
import { QueryParams } from '../../../helpers/types'

export interface ByFile {
  track: ReadStream
  page?: number
  page_size?: number
}

type Request = ByFile & Filtering & QueryParams

export const plugByFile =
  (client: () => AxiosInstance, path: 'playlist') =>
  async (request: Request): Promise<Response<SimilarCollectionsResponse>> => {
    const data = new FormData()
    transformObjToFormData(data, request)
    return await plug(client, path, 'by-file', data)
  }
