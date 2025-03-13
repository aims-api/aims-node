import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { plug } from './index'

export interface ByFileUrl {
  track: string
  page?: number
  page_size?: number
}

export const plugByFileUrl =
  (client: () => AxiosInstance, path: 'playlist') =>
  async (request: ByFileUrl): Promise<Response<SimilarCollectionsResponse>> => {
    return await plug(client, path, 'by-file-url', request)
  }
