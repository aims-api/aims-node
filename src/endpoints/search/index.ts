import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import { z } from 'zod'
import { QueryParams } from '../../helpers/types'
import { lyricsSearchSchema, trackDetailedSchema, trackSchema } from '../../helpers/types/track'
import { totalsSchema } from '../../helpers/types/search'
import { Filtering } from '../../helpers/filtering'

// Announcement: too strict rule
/* const seedTypeSchema = z.enum([
  'tag',
  'prompt',
  'url',
  'track',
  'full-text',
  'file-url',
  'numeric',
  'track_name',
  'track_description',
  'track_number',
  'album_name',
  'album_code',
  'album_number',
  'label_name',
  'label_code',
  'publisher',
  'artists',
  'composers',
  'usages',
  'vocals',
  'moods',
  'genres',
  'instruments',
  'decades',
]) */

const seedSchema = z.object({
  type: z.string(), // seedTypeSchema,
  value: z.string().or(trackDetailedSchema),
  included: z.boolean(),
})

export const searchResponseSchema = z.object({
  aggregations: z.nullable(z.any()), // TODO
  did_you_mean: z.array(seedSchema),
  lyrics_search: lyricsSearchSchema,
  query_id: z.string(),
  totals: totalsSchema,
  tracks: z.array(trackSchema),
  type: z.enum([
    'tag',
    'prompt',
    'url',
    'internal',
    'file-url',
    'prompt-and-keyword',
    'keyword',
    'full-text',
    'code',
    'numeric',
    'code-and-keyword',
    'code-and-prompt',
    'internal-and-prompt',
  ]),
})

export type SearchResponse = z.infer<typeof searchResponseSchema>

// Announcement: this type is used only by /src/client/index.ts endpoints
export interface SearchRequest {
  query: string
  page?: number
  page_size?: number
}

type Request = QueryParams & SearchRequest & Filtering

export const search =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<SearchResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/search`, request)
      if (request.detailed === true) {
        const parserResponseDetailed = searchResponseSchema
          .merge(z.object({ tracks: z.array(trackDetailedSchema) }))
          .parse(response.data)
        return successResponse(parserResponseDetailed)
      }
      const parserResponse = searchResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }
