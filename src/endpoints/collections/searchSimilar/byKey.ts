import { AxiosInstance } from 'axios'
import { Response } from '../../../helpers/apiResponse'
import { searchSimilar } from './index'
import { SimilarCollectionsQueryParams, SimilarCollectionsResponse } from '../../../helpers/types/collection'
import { Filter } from '../../../helpers/filtering'

export interface SimilarSearchByKey {
  data: {
    key: string
    detailed?: boolean
    filter?: Filter
    group_id?: string
  }
}

const byKey =
  (client: () => AxiosInstance, path: string) =>
  async (
    request: SimilarSearchByKey & SimilarCollectionsQueryParams,
  ): Promise<Response<SimilarCollectionsResponse>> => {
    return await searchSimilar(client, path, 'by-key', request)
  }

export { byKey }
