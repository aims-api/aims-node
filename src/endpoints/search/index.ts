import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import { z } from 'zod'
import { QueryParams } from '../../helpers/types'
import { lyricsSearchSchema, trackDetailedSchema, trackSchema } from '../../helpers/types/track'
import { totalsSchema } from '../../helpers/types/search'
import { Filtering } from '../../helpers/filtering'

/* 
Announcement: too strict rules

const seedTypeSchema = z.enum([
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
]) 

const searchResponseTypeSchema = z.enum([
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
    'seeds-only',
  ])

*/

const seedSchema = z.object({
  type: z.string(), // seedTypeSchema,
  value: z.any(), // z.string().or(trackDetailedSchema),
  included: z.boolean(),
})

const artistSchema = z.object({
  contact: z.string().nullable(),
  description: z.string().nullable(),
  followers: z.number().nullable(),
  id: z.string(),
  key: z.string(),
  keywords: z.array(z.string()).nullable(),
  number_of_tracks: z.number().nullable(),
  owner: z.string().nullable(),
  processed_at: z.string().nullable(),
  title: z.string(),
  monthly_listeners: z.number().nullable(),
  last_release_year: z.number().nullable(),
  first_release_year: z.number().nullable(),
  listener_territories: z.any().nullable(),
  socials: z.any().nullable(),
  on_tour: z.boolean().nullable(),
})

const albumSchema = z.object({
  id: z.string(),
  key: z.string(),
  processed_at: z.string().nullable(),
  title: z.string(),
  // contact: z.string().nullable(),
  description: z.string().nullable(),
  first_release_year: z.string().nullable(),
  followers: z.number().nullable(),
  keywords: z.array(z.string()).nullable(),
  last_release_year: z.string().nullable(),
  listener_territories: z.array(z.string()).nullable(),
  monthly_listeners: z.number().nullable(),
  number_of_tracks: z.number(),
  on_tour: z.boolean().nullable(),
  owner: z.array(z.string()).nullable(),
  socials: z.array(z.string()).nullable(),
  thumbnails: z.record(z.string()).nullable(),
  auto_tagging_output: z.optional(z.nullable(z.record(z.any()))),
})

const collectionsSchema = z.object({
  artists: z.array(artistSchema).optional(),
  albums: z.array(albumSchema).optional(),
})

export const searchResponseSchema = z.object({
  aggregations: z.nullable(z.any()), // Announcement: Future type for aggregations may be Record<string, {[string]: number, value: string}[]>
  collections: collectionsSchema.optional(),
  lyrics_search: lyricsSearchSchema,
  did_you_mean: z.array(seedSchema),
  query_id: z.string(),
  totals: totalsSchema,
  tracks: z.array(trackSchema),
  type: z.string(), // searchResponseTypeSchema
})

export type SearchResponse = z.infer<typeof searchResponseSchema>

// Announcement: this type is used only by /src/client/index.ts endpoints
export interface SearchRequest {
  query?: string
  page?: number
  page_size?: number
  ignore_track_results?: boolean
  seeds?: Array<{ type: string; value: string }>
  include_collection_result_types?: {
    artists?: boolean
  }
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
