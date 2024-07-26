import { z } from 'zod'

export interface BySystemId {
  system_id: string
}

export interface ByClientId {
  client_id: string
}

export interface QueryParams {
  detailed?: boolean
}

export interface Metadata {
  release_year?: number
  track_name?: string
  track_number?: string
  track_description?: string
  track_code?: string
  version?: boolean
  version_tag?: string
  version_name?: string
  master_track_number?: string
  isrc?: string
  label_name?: string
  label_code?: string
  label_lc_name?: string
  album_number?: string
  album_code?: string
  album_name?: string
  album_description?: string
  tempo?: string
  bpm?: number
  music_key?: string
  music_meter?: string
  lyrics?: string
  lyrics_language?: string
  artists?: Array<string>
  composers?: Array<string>
  publisher?: string
  genres?: Array<string>
  instruments?: Array<string>
  moods?: Array<string>
  filepath?: string
  music_for?: Array<string>
  album_keywords?: Array<string>
  cuesheet_info?: string
  active?: boolean
  licensable?: boolean
  restricted?: boolean
  commercial?: boolean
  territories?: Array<string>
  decades?: Array<string>
  subgenres?: Array<string>
  master_track_id?: string
  vocals?: Array<string>
  sync_history?: boolean
  recognisable?: boolean
  jam_sync?: boolean
  hit?: boolean
  top?: boolean
  publishing_partner_us?: string
  publishing_partner?: string
  share?: number
  owner?: string
  external_id?: string
}

export const countResponseSchema = z.object({
  length: z.number(),
})

export type CountResponse = z.infer<typeof countResponseSchema>

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type MessageResponse = z.infer<typeof messageResponseSchema>
