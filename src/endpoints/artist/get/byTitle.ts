import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { Response, parseError, successResponse } from '../../../helpers/apiResponse'
import { CollectionsList, collectionsListSchema } from '../../../helpers/types/collection'

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
export interface ByTitle {
  title: string
  page?: number
  page_size?: number
}

const byTitle =
  (client: () => AxiosInstance) =>
  async (params: ByTitle): Promise<Response<CollectionsList>> => {
    try {
      const response = await client().get(`/${API_VERSION}/artists/search`, { params })
      const parserResponse = collectionsListSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { byTitle }
