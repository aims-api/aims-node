import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { plug } from './index'

export interface ById {
  track_id: string
  page?: number
  page_size?: number
  detailed?: boolean
}

const plugById =
  (client: () => AxiosInstance, path: 'playlist') =>
  async (request: ById): Promise<Response<SimilarCollectionsResponse>> => {
    return await plug(client, path, 'by-id', request)
  }

export { plugById }
