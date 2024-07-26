import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { plug } from './index'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { ReadStream } from 'fs'
import FormData from 'form-data'
import { transformObjToFormData } from '../../../helpers/utils'

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
