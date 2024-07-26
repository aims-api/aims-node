import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { SimilarSearchDetailedResponse, SimilarSearchResponse } from '../../../helpers/types/track'
import { Filtering } from '../../../helpers/filtering'
import { ClientSystem, createPlaylist, Link, PlaylistRequest, File } from './index'
import { QueryParams } from '../../../helpers/types'

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
