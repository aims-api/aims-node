import { AxiosInstance } from 'axios'
import { Response } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { query } from './index'

export interface QueryById {
  track_id: string | number
  input_id_type?: 'system' | 'client'
  page?: number
  page_size?: number
  time_offset?: number
  time_limit?: number
  ignore_same_album?: boolean
  ignore_versions?: boolean
  highlights?: boolean
  prioritise_bpm?: boolean
}

type Request = QueryById & Filtering & QueryParams

const byId =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    return await query(client, 'by-id', request)
  }

export { byId }
