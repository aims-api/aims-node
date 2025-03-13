import { AxiosInstance } from 'axios'
import { Response } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { query } from './index'

export interface QueryByAudioFileHash {
  hash: string
  page?: number
  page_size?: number
  time_offset?: number
  time_limit?: number
  highlights?: boolean
  suppress_vocals?: boolean
  prioritise_bpm?: boolean
}

type Request = QueryByAudioFileHash & Filtering & QueryParams

const byAudioFileHash =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    return await query(client, 'by-file-hash', request)
  }

export { byAudioFileHash }
