import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { Filtering } from '../../../helpers/filtering'
import { QueryParams } from '../../../helpers/types'
import { SimilarSearchDetailedResponse, SimilarSearchResponse } from '../../../helpers/types/track'
import { ClientSystem, File, Link, PlaylistRequest, createPlaylist } from './index'

interface MultipleSeeds {
  tracks: Array<ClientSystem | Link | File>
}

export type MultipleSeedsRequest = {
  data: MultipleSeeds & PlaylistRequest
  params?: QueryParams
} & Filtering

const multipleSeeds =
  (client: () => AxiosInstance) =>
  async (request: MultipleSeedsRequest): Promise<Response<SimilarSearchResponse | SimilarSearchDetailedResponse>> => {
    return await createPlaylist(client, 'multiple-seeds', request)
  }

export { multipleSeeds }
