import { TrackDetailedResponse, TrackResponse } from '../src/helpers/types/track'

export const trackDetails = {
  track_number: 'track_number',
  track_code: 'track_code',
  track_description: 'track_description',
  version: true,
  version_tag: 'version_tag',
  version_name: 'version_name',
  master_track_id: 'master_track_id',
  master_track_number: 'master_track_number',
  isrc: 'isrc',
  label_name: 'label_name',
  label_code: 'label_code',
  label_lc_name: 'label_lc_name',
  album_number: 'album_number',
  album_code: 'album_code',
  album_name: 'album_name',
  album_description: 'album_description',
  tempo: 'tempo',
  bpm: 123,
  music_key: 'music_key',
  music_meter: 'music_meter',
  lyrics: 'lyrics',
  lyrics_language: 'lyrics_language',
  artists: ['artist1', 'artist2'],
  composers: ['composer1', 'composer2'],
  publisher: 'publisher',
  genres: ['genre1', 'genre2'],
  instruments: ['instrument1', 'instrument2'],
  moods: ['mood1', 'mood2'],
  music_for: ['music_for1', 'music_for2'],
  album_keywords: ['keyword1', 'keyword2'],
  active: true,
  licensable: true,
  restricted: true,
  commercial: true,
  process_input_error_details: 'process_input_error_details',
  explicit: false,
  profane: false,
  territories: ['ter1', 'ter2'],
  decades: ['1980s', '1990s'],
  vocals: ['vocal1', 'vocal2'],
  owner: ['owner1'],
  publishing_partner: null,
  publishing_partner_us: null,
  recognisable: true,
  share: '1',
  top: true,
  subgenres: ['a', 'b'],
  categories: ['a', 'b'],
  looped: false,
  pro_affiliated: false,
  content_id_registered: true,
  visibility: ['a', 'b', 'c'],
  released_at: {
    date: '2018',
    timezone_type: 3,
    timezone: 'UTC',
  },
  custom_data: 'custom_data',
  auto_tagging_output: { genres: [] },
  net_duration: { duration: 0 },
  filepath: 'filepath',
  external_id: 'external_id',
  sync_history: false,
  jam_sync: false,
  hit: false,
  artist_canonical: 'artist_canonical',
  cuesheet_info: 'cuesheet_info',
  add_file_hash: 'add_file_hash',
}

export const generalTrackProps = {
  id_client: 'foo',
  duration: 240,
  release_year: 2003,
  tags: ['foo', 'bar'],
  processed_at: {
    date: '2018',
    timezone_type: 3,
    timezone: 'UTC',
  },
  process_input_error: 'null',
  store_secret: '12bj143bapie213',
}

export const responseDataBySystemId: TrackResponse = {
  track: {
    id: 1,
    track_name: 'track by-system-id',
    ...generalTrackProps,
  },
}

export const responseDataByClientIdDetailed: TrackDetailedResponse = {
  track: {
    id: 2,
    track_name: 'track by-client-id-detailed',
    ...generalTrackProps,
    ...trackDetails,
  },
}

export const responseDataBySystemIdDetailed: TrackDetailedResponse = {
  track: {
    id: 1,
    track_name: 'track by-system-id-detailed',
    ...generalTrackProps,
    ...trackDetails,
  },
}

export const responseDataByClientId: TrackResponse = {
  track: {
    id: 2,
    track_name: 'track by-client-id',
    ...generalTrackProps,
  },
}
