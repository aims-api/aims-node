import { z } from 'zod'

const trackOnlyDetailedSchema = z.object({
  streaming_hash: z.optional(z.string()),
  streaming_id: z.optional(z.number()),
  track_number: z.nullable(z.string()),
  track_code: z.nullable(z.string()),
  track_description: z.nullable(z.string()),
  version: z.nullable(z.boolean()),
  version_tag: z.nullable(z.string()),
  version_name: z.nullable(z.string()),
  master_track_number: z.nullable(z.string()),
  master_track_id: z.nullable(z.string()),
  isrc: z.nullable(z.string()),
  label_name: z.nullable(z.string()),
  label_code: z.nullable(z.string()),
  label_lc_name: z.nullable(z.string()),
  album_number: z.nullable(z.string()),
  album_code: z.nullable(z.string()),
  album_name: z.nullable(z.string()),
  album_description: z.nullable(z.string()),
  tempo: z.nullable(z.string()),
  bpm: z.nullable(z.number()),
  music_key: z.nullable(z.string()),
  music_meter: z.nullable(z.string()),
  lyrics: z.nullable(z.string()),
  lyrics_language: z.nullable(z.string()),
  artists: z.nullable(z.array(z.string())),
  composers: z.nullable(z.array(z.string())),
  publisher: z.nullable(z.string()),
  genres: z.nullable(z.array(z.string())),
  instruments: z.nullable(z.array(z.string())),
  moods: z.nullable(z.array(z.string())),
  music_for: z.nullable(z.array(z.string())),
  album_keywords: z.nullable(z.array(z.string())),
  active: z.nullable(z.boolean()),
  licensable: z.nullable(z.boolean()),
  restricted: z.nullable(z.boolean()),
  commercial: z.nullable(z.boolean()),
  process_input_error_details: z.nullable(z.string()),
  explicit: z.nullable(z.boolean()),
  profane: z.nullable(z.boolean()),
  territories: z.nullable(z.array(z.string())),
  decades: z.nullable(z.array(z.string())),
  vocals: z.nullable(z.array(z.string())),
  owner: z.nullable(z.array(z.string())),
  publishing_partner: z.nullable(z.array(z.string())),
  publishing_partner_us: z.nullable(z.array(z.string())),
  recognisable: z.nullable(z.boolean()),
  share: z.nullable(z.number()),
  top: z.nullable(z.boolean()),
  subgenres: z.nullable(z.array(z.string())),
  categories: z.nullable(z.array(z.string())),
  looped: z.nullable(z.boolean()),
  pro_affiliated: z.nullable(z.boolean()),
  content_id_registered: z.nullable(z.boolean()),
  visibility: z.nullable(z.array(z.string())),
  released_at: z.nullable(
    z
      .object({
        date: z.string(),
        timezone_type: z.number(),
        timezone: z.string(),
      })
      .or(z.string()),
  ),
  custom_data: z.nullable(z.any()),
  auto_tagging_output: z.optional(z.nullable(z.record(z.any()))),
  net_duration: z.optional(z.nullable(z.record(z.any()))),
  filepath: z.nullable(z.string()),
  external_id: z.nullable(z.string()),
  sync_history: z.nullable(z.boolean()),
  jam_sync: z.nullable(z.boolean()),
  hit: z.nullable(z.boolean()),
  artist_canonical: z.optional(z.nullable(z.string())),
  cuesheet_info: z.nullable(z.string()),
  add_file_hash: z.optional(z.nullable(z.string())),
})

export const trackSchema = z.object({
  id: z.string().or(z.number()),
  id_client: z.string(),
  duration: z.nullable(z.number()),
  release_year: z.nullable(z.number()),
  track_name: z.string(),
  tags: z.nullable(z.array(z.string())),
  processed_at: z.nullable(
    z
      .object({
        date: z.string(),
        timezone_type: z.number(),
        timezone: z.string(),
      })
      .or(z.string()),
  ),
  process_input_error: z.nullable(z.string()),
  store_secret: z.nullable(z.string()),
  highlights: z.optional(
    z.array(
      z.object({
        duration: z.number(),
        offset: z.number(),
      }),
    ),
  ),
})

export const trackResponseSchema = z.object({
  track: trackSchema,
})
export const trackDetailedSchema = trackSchema.merge(trackOnlyDetailedSchema)
export const trackDetailedResponseSchema = z.object({
  track: trackDetailedSchema,
})

export type TrackResponse = z.infer<typeof trackResponseSchema>
export type TrackDetailedResponse = z.infer<typeof trackDetailedResponseSchema>

export const lyricsSearchSchema = z.optional(
  z.object({
    active: z.boolean(), // Announcement: always true if response.lyrics_search !== undefined
    terms: z.array(z.string()),
  }),
)

export const similarSearchResponseSchema = z.object({
  query_id: z.string(),
  tracks: z.array(trackSchema),
  hash: z.optional(z.string()),
  lyrics_search: lyricsSearchSchema,
})

export const similarSearchDetailedResponseSchema = z.object({
  query_id: z.string(),
  tracks: z.array(trackDetailedSchema),
  hash: z.optional(z.string()),
  lyrics_search: lyricsSearchSchema,
})

export type SimilarSearchResponse = z.infer<typeof similarSearchResponseSchema>
export type SimilarSearchDetailedResponse = z.infer<typeof similarSearchDetailedResponseSchema>

export const trackListResponseSchema = z.object({
  tracks: z.array(trackSchema),
  pagination: z.object({
    item_count: z.number(),
    page: z.number(),
    page_size: z.number(),
    page_count: z.number(),
  }),
})

export const trackListDetailedResponseSchema = z.object({
  tracks: z.array(trackDetailedSchema),
  pagination: z.object({
    item_count: z.number(),
    page: z.number(),
    page_size: z.number(),
    page_count: z.number(),
  }),
})

export type TrackListResponse = z.infer<typeof trackListResponseSchema>
export type TrackListDetailedResponse = z.infer<typeof trackListDetailedResponseSchema>
