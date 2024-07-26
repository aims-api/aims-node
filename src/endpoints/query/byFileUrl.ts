import { AxiosInstance } from 'axios'
import { Response } from '../../helpers/apiResponse'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { Filtering } from '../../helpers/filtering'
import { query } from './index'
import { QueryParams } from '../../helpers/types'

export interface QueryByFileUrl {
  track: string
  page?: number
  page_size?: number
  time_offset?: number
  time_limit?: number
}

type Request = QueryByFileUrl & Filtering & QueryParams

const byFileUrl =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    return await query(client, 'by-file-url', request)
  }

export { byFileUrl }
