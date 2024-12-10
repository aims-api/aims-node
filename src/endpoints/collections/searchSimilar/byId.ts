import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { searchSimilar } from './index'
import { SimilarCollectionsQueryParams, SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { Filter } from '../../../helpers/filtering'

export interface SimilarSearchById {
  data: {
    id: string
    group_id?: string
    detailed?: boolean
    filter?: Filter
  }
}

const byId =
  (client: () => AxiosInstance, path: string) =>
  async (request: SimilarSearchById & SimilarCollectionsQueryParams): Promise<Response<SimilarCollectionsResponse>> => {
    return await searchSimilar(client, path, 'by-id', request)
  }

export { byId }
