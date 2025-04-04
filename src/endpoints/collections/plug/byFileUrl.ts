import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { plug } from './index'
import { Filtering } from '../../../helpers/filtering'
import { QueryParams } from '../../../helpers/types'

export interface ByFileUrl {
  track: string
  page?: number
  page_size?: number
}

type Request = ByFileUrl & Filtering & QueryParams

export const plugByFileUrl =
  (client: () => AxiosInstance, path: 'playlist') =>
  async (request: Request): Promise<Response<SimilarCollectionsResponse>> => {
    return await plug(client, path, 'by-file-url', request)
  }
