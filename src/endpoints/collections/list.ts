import { AxiosInstance } from 'axios'
import {
  CollectionsList,
  CollectionsListDetailed,
  collectionsListSchema,
  collectionsListSchemaDetailed,
} from '../../helpers/types/collection'
import { API_VERSION } from '../../consts'
import { parseError, successResponse, Response } from '../../helpers/apiResponse'

// ANNOUNC: this type is exported for /src/client/index.ts endpoints (TS bug?)
export interface ListParams {
  page?: number
  page_size?: number
  groups?: boolean
  show_hidden?: boolean
  user_id?: string
  detailed?: boolean
}

export const listCollection =
  (client: () => AxiosInstance, path: 'project' | 'playlist' | 'custom-tag') =>
  async (params?: ListParams): Promise<Response<CollectionsList | CollectionsListDetailed>> => {
    try {
      const response = await client().get(`/${API_VERSION}/${path}`, {
        params: { ...params, show_hidden: params?.show_hidden ? 1 : undefined },
      })
      if (response.status === 204) {
        // Announcement: "No content" response transformation
        return successResponse({
          collections: [],
          pagination: {
            item_count: 0,
          },
        })
      }
      const parserResponse = (params?.detailed ? collectionsListSchemaDetailed : collectionsListSchema).parse(
        response.data,
      )
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
