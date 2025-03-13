import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { Filtering } from '../../../helpers/filtering'
import { QueryParams } from '../../../helpers/types'
import { SimilarSearchDetailedResponse, SimilarSearchResponse } from '../../../helpers/types/track'
import { ClientSystem, File, Link, PlaylistRequest, createPlaylist } from './index'

interface SingleSeed {
  track: ClientSystem | Link | File
}

export type SingleSeedRequest = {
  data: SingleSeed & PlaylistRequest
  params?: QueryParams
} & Filtering

const singleSeed =
  (client: () => AxiosInstance) =>
  async (request: SingleSeedRequest): Promise<Response<SimilarSearchResponse | SimilarSearchDetailedResponse>> => {
    return await createPlaylist(client, 'single-seed', request)
  }

export { singleSeed }
