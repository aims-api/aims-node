import { AxiosInstance } from 'axios'
import { Response } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { query } from './index'

export interface QueryByTag {
  tag_id: number
  page?: number
  page_size?: number
}

type Request = QueryByTag & Filtering & QueryParams

const byTag =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    return await query(client, 'by-tag', request)
  }

export { byTag }
