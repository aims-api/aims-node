import { z } from 'zod'
import { trackDetailedSchema } from './track'

export interface GetCollection {
  id: string
  params?: {
    groups?: boolean
  }
}

export const groupingDataSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    tracks: z.array(z.number().or(z.string())),
  }),
)

export const collectionSchema = z.object({
  id: z.string(),
  key: z.string(),
  processed_at: z.nullable(z.string()),
  updated_at: z.string(),
  title: z.string(),
  description: z.optional(z.nullable(z.string())),
  grouping_data: z.optional(z.nullable(groupingDataSchema)),
  thumbnails: z.nullable(z.any()),
})

export const detailedCollectionSchema = z
  .object({
    thumbnails: z.nullable(z.any()),
    followers: z.nullable(z.any()),
    owner: z.nullable(z.any()),
    contact: z.nullable(z.any()),
    number_of_tracks: z.number(),
    keywords: z.nullable(z.any()),
    monthly_listeners: z.nullable(z.number()),
    last_release_year: z.nullable(z.number()),
    first_release_year: z.nullable(z.number()),
    listener_territories: z.nullable(z.any()),
    socials: z.nullable(z.any()),
    on_tour: z.nullable(z.boolean()),
    is_exported: z.nullable(z.boolean()),
  })
  .merge(collectionSchema)

export const collectionResponseSchema = z.object({
  collection: collectionSchema,
})

export const similarCollectionsResponseSchema = z.object({
  query_id: z.string(),
  collections: z.array(collectionSchema),
})

export const similarCollectionsResponseSchemaDetailed = z.object({
  query_id: z.string(),
  collections: z.array(detailedCollectionSchema),
})

export type Collection = z.infer<typeof collectionSchema>
export type CollectionResponse = z.infer<typeof collectionResponseSchema>
export type SimilarCollectionsResponse = z.infer<typeof similarCollectionsResponseSchema>
export type SimilarCollectionsResponseDetailed = z.infer<typeof similarCollectionsResponseSchemaDetailed>

export interface SimilarCollectionsQueryParams {
  params?: {
    page?: number
    page_size?: number
  }
}

export const collectionsListSchemaDetailed = z.object({
  collections: z.array(detailedCollectionSchema),
  pagination: z.object({
    item_count: z.number(),
    // TODO is not returned
    // page: z.number(),
    // page_size: z.number(),
    // page_count: z.number()
  }),
})

export const collectionsListSchema = z.object({
  collections: z.array(collectionSchema),
  pagination: z.object({
    item_count: z.number(),
    // TODO is not returned
    // page: z.number(),
    // page_size: z.number(),
    // page_count: z.number()
  }),
})

export type CollectionsList = z.infer<typeof collectionsListSchema>
export type CollectionsListDetailed = z.infer<typeof collectionsListSchemaDetailed>

export type CollectionType = 'project' | 'playlist' | 'custom-tag' | 'albums' | 'artists'

export const snapshotSchema = z.object({
  created_at: z.string(),
  description: z.optional(z.nullable(z.string())),
  id: z.string(),
  metadata: z.array(z.string()),
  number_of_tracks: z.nullable(z.number()),
  title: z.string(),
  tracks: z.array(trackDetailedSchema),
  streaming_secret: z.string(),
  downloadable: z.boolean(),
})

export type Snapshot = z.infer<typeof snapshotSchema>
