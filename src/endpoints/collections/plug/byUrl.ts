import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { plug } from './index'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'

export interface ByUrl {
  link: string
  page?: number
  page_size?: number
}

export const plugByUrl =
  (client: () => AxiosInstance, path: 'playlist') =>
  async (request: ByUrl): Promise<Response<SimilarCollectionsResponse>> => {
    return await plug(client, path, 'by-url', request)
  }
