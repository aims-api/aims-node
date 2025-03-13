import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { Filtering } from '../../../helpers/filtering'
import { QueryParams } from '../../../helpers/types'
import { SimilarSearchDetailedResponse, SimilarSearchResponse } from '../../../helpers/types/track'
import { ClientSystem, File, Link, PlaylistRequest, createPlaylist } from './index'

interface Transition {
  from_track: ClientSystem | Link | File
  to_track: ClientSystem | Link | File
}

export type TransitionRequest = {
  data: Transition & PlaylistRequest
  params?: QueryParams
} & Filtering

const transition =
  (client: () => AxiosInstance) =>
  async (request: TransitionRequest): Promise<Response<SimilarSearchResponse | SimilarSearchDetailedResponse>> => {
    return await createPlaylist(client, 'transition', request)
  }

export { transition }
