import { z } from 'zod'

const metadataSchema = z.object({
  release_year: z.nullable(z.number()),
  track_name: z.string(),
})

const metadataDetailedSchema = z.object({
  add_file_hash: z.optional(z.nullable(z.string())),
  active: z.nullable(z.boolean()),
  album_code: z.nullable(z.string()),
  album_description: z.nullable(z.string()),
  album_keywords: z.nullable(z.array(z.string())),
  album_name: z.nullable(z.string()),
  album_number: z.nullable(z.string()),
  artist_canonical: z.optional(z.nullable(z.string())),
  artists: z.nullable(z.array(z.string())),
  auto_tagging_output: z.optional(z.nullable(z.record(z.any()))),
  bpm: z.nullable(z.number()),
  categories: z.nullable(z.array(z.string())),
  commercial: z.nullable(z.boolean()),
  composers: z.nullable(z.array(z.string())),
  content_id_registered: z.nullable(z.boolean()),
  custom_data: z.nullable(z.any()),
  cuesheet_info: z.nullable(z.string()),
  decades: z.nullable(z.array(z.string())),
  explicit: z.nullable(z.boolean()),
  external_id: z.nullable(z.string()),
  filepath: z.nullable(z.string()),
  genres: z.nullable(z.array(z.string())),
  hit: z.nullable(z.boolean()),
  instruments: z.nullable(z.array(z.string())),
  isrc: z.nullable(z.string()),
  jam_sync: z.nullable(z.boolean()),
  label_code: z.nullable(z.string()),
  label_lc_name: z.nullable(z.string()),
  label_name: z.nullable(z.string()),
  licensable: z.nullable(z.boolean()),
  looped: z.nullable(z.boolean()),
  lyrics: z.nullable(z.string()),
  lyrics_language: z.nullable(z.string()),
  master_track_id: z.nullable(z.string()),
  master_track_number: z.nullable(z.string()),
  moods: z.nullable(z.array(z.string())),
  music_for: z.nullable(z.array(z.string())),
  music_key: z.nullable(z.string()),
  music_meter: z.nullable(z.string()),
  net_duration: z.optional(z.nullable(z.record(z.any()))),
  owner: z.nullable(z.array(z.string())),
  process_input_error_details: z.nullable(z.string()),
  pro_affiliated: z.nullable(z.boolean()),
  profane: z.nullable(z.boolean()),
  publisher: z.nullable(z.string()),
  publishing_partner: z.nullable(z.array(z.string())),
  publishing_partner_us: z.nullable(z.array(z.string())),
  recognisable: z.nullable(z.boolean()),
  released_at: z.nullable(
    z
      .object({
        date: z.string(),
        timezone_type: z.number(),
        timezone: z.string(),
      })
      .or(z.string()),
  ),
  restricted: z.nullable(z.boolean()),
  share: z.nullable(z.number()),
  streaming_hash: z.optional(z.string()),
  streaming_id: z.optional(z.number()),
  subgenres: z.nullable(z.array(z.string())),
  sync_history: z.nullable(z.boolean()),
  tempo: z.nullable(z.string()),
  territories: z.nullable(z.array(z.string())),
  top: z.nullable(z.boolean()),
  track_code: z.nullable(z.string()),
  track_description: z.nullable(z.string()),
  track_name: z.string(),
  track_number: z.nullable(z.string()),
  version: z.nullable(z.boolean()),
  version_name: z.nullable(z.string()),
  version_tag: z.nullable(z.string()),
  visibility: z.nullable(z.array(z.string())),
  vocals: z.nullable(z.array(z.string())),
})

const completeMetadataSchema = metadataSchema.merge(metadataDetailedSchema)
export type Metadata = z.infer<typeof completeMetadataSchema>

export const trackSchema = z
  .object({
    id: z.string().or(z.number()),
    id_client: z.string(),
    duration: z.nullable(z.number()),
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
  .merge(metadataSchema)

export const trackResponseSchema = z.object({
  track: trackSchema,
})
export const trackDetailedSchema = trackSchema.merge(metadataDetailedSchema)
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
