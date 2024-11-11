interface FieldValueInteger {
  field: 'bpm' | 'duration' | 'id' | 'release_year'
  value: number
}

interface FieldValueBoolean {
  field: 'active' | 'commercial' | 'explicit' | 'licensable' | 'profane' | 'restricted' | 'version'
  value: boolean
}

interface FieldValueString {
  field:
    | 'album_code'
    | 'album_description'
    | 'album_keywords'
    | 'album_name'
    | 'album_number'
    | 'artists'
    | 'composers'
    | 'cuesheet_info'
    | 'decades'
    | 'filepath'
    | 'genres'
    | 'id_client'
    | 'instruments'
    | 'isrc'
    | 'label_code'
    | 'label_lc_name'
    | 'label_name'
    | 'lyrics'
    | 'lyrics_language'
    | 'master_track_id'
    | 'master_track_number'
    | 'moods'
    | 'music_for'
    | 'music_key'
    | 'music_meter'
    | 'processed_at'
    | 'publisher'
    | 'subgenres'
    | 'tags'
    | 'tempo'
    | 'territories'
    | 'track_code'
    | 'track_description'
    | 'track_name'
    | 'track_number'
    | 'version_tag'
    | 'vocals'
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
