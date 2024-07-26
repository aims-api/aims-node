import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { SimilarSearchDetailedResponse, SimilarSearchResponse } from '../../../helpers/types/track'
import { Filtering } from '../../../helpers/filtering'
import { ClientSystem, createPlaylist, Link, File, PlaylistRequest } from './index'
import { QueryParams } from '../../../helpers/types'

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
