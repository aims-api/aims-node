import { ReadStream } from 'node:fs'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { Response } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { transformObjToFormData } from '../../../helpers/utils'
import { plug } from './index'

export interface ByFile {
  track: ReadStream
}

export const plugByFile =
  (client: () => AxiosInstance, path: 'playlist') =>
  async (request: ByFile): Promise<Response<SimilarCollectionsResponse>> => {
    const data = new FormData()
    transformObjToFormData(data, request)
    return await plug(client, path, 'by-file', data)
  }
