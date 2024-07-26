import { AxiosInstance } from 'axios'
import { Response } from '../../helpers/apiResponse'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { Filtering } from '../../helpers/filtering'
import { query } from './index'
import { QueryParams } from '../../helpers/types'

export interface QueryByTextHash {
  hash: string
  page?: number
  page_size?: number
}

type Request = QueryByTextHash & Filtering & QueryParams

const byTextHash =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    return await query(client, 'by-text-hash', request)
  }

export { byTextHash }
