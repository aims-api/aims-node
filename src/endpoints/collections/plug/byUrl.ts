import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { plug } from './index'

export interface ByUrl {
  link: string
  page?: number
  page_size?: number
  detailed?: boolean
}

export const plugByUrl =
  (client: () => AxiosInstance, path: 'playlist') =>
    async (request: ByUrl): Promise<Response<SimilarCollectionsResponse>> => {
      return await plug(client, path, 'by-url', request)
    }
