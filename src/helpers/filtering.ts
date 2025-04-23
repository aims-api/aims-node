interface FieldValueInteger {
  field: 'id' | 'duration' | 'release_year' | 'bpm'
  value: number
}

interface FieldValueBoolean {
  field: 'version' | 'active' | 'licensable' | 'restricted' | 'explicit' | 'profane' | 'commercial' | 'is_hidden'
  value: boolean
}

interface FieldValueString {
  field:
    | 'track_name'
    | 'id_client'
    | 'tags'
    | 'filepath'
    | 'processed_at'
    | 'track_number'
    | 'track_code'
    | 'track_description'
    | 'version_tag'
    | 'master_track_number'
    | 'master_track_id'
    | 'isrc'
    | 'label_name'
    | 'label_code'
    | 'label_lc_name'
    | 'album_number'
    | 'album_code'
    | 'album_name'
    | 'album_description'
    | 'tempo'
    | 'music_key'
    | 'music_meter'
    | 'lyrics'
    | 'lyrics_language'
    | 'artists'
    | 'composers'
    | 'publisher'
    | 'genres'
    | 'subgenres'
    | 'instruments'
    | 'moods'
    | 'music_for'
    | 'decades'
    | 'vocals'
    | 'album_keywords'
    | 'cuesheet_info'
    | 'territories'
    | 'user_id'
  value: string
}

type RuleInteger = { operator: 'gt' | 'gte' | 'gten' | 'lt' | 'lte' } & FieldValueInteger
type RuleString = {
  operator: 'begins' | 'contains' | 'not-contains' | 'ends' | 'empty' | 'not-empty' | 'in'
} & FieldValueString
type RuleGeneral = {
  operator: 'eq' | 'neq' | 'null' | 'not-null'
} & (FieldValueInteger | FieldValueBoolean | FieldValueString)

type Rule = RuleInteger | RuleString | RuleGeneral

export interface Filter {
  logic: 'and' | 'or'
  conditions: Array<Rule | Filter>
}

export interface Filtering {
  filter?: Filter
}
