import { ReadStream } from 'node:fs'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { Response } from '../../helpers/apiResponse'
import { Filtering } from '../../helpers/filtering'
import { QueryParams } from '../../helpers/types'
import { SimilarSearchResponse } from '../../helpers/types/track'
import { transformObjToFormData } from '../../helpers/utils'
import { query } from './index'

export interface QueryByAudioFile {
  track: ReadStream
  page?: number
  page_size?: number
  time_offset?: number
  time_limit?: number
  highlights?: boolean
  suppress_vocals?: boolean
  prioritise_bpm?: boolean
}

type Request = QueryByAudioFile & Filtering & QueryParams

const byAudioFile =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SimilarSearchResponse>> => {
    const data = new FormData()
    transformObjToFormData(data, request)
    return await query(client, 'by-file', data, request.detailed)
  }

export { byAudioFile }
