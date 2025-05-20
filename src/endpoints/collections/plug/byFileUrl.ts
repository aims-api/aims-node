import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { Filtering } from '../../../helpers/filtering'
import { QueryParams } from '../../../helpers/types'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { plug } from './index'

export interface ByFileUrl {
  track: string
  page?: number
  page_size?: number
}

type Request = ByFileUrl & Filtering & QueryParams

export const plugByFileUrl =
  (client: () => AxiosInstance, path: 'playlist') =>
  (request: Request): Promise<Response<SimilarCollectionsResponse>> => {
    return plug(client, path, 'by-file-url', request)
  }
