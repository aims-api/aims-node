import { AxiosInstance } from 'axios'
import { Response } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { query } from './index'

export interface QueryByIds {
  track_ids: Array<string | number>
  input_id_type?: 'system' | 'client'
  page?: number
  page_size?: number
}

type Request = QueryByIds & Filtering & QueryParams

const byIds =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    return await query(client, 'by-ids', request)
  }

export { byIds }
