import z from 'zod'

const totalSchema = z.object({
  value: z.number(),
  relation: z.optional(z.enum(['gte', 'eq'])), // Announcement: "greater than or equal" or "equal"
})

export const totalsSchema = z.object({
  albums: z.optional(totalSchema),
  artists: z.optional(totalSchema),
  playlists: z.optional(totalSchema),
  tags: z.optional(totalSchema),
  tracks: z.optional(totalSchema),
})

export const suggestionSchema = z.object({
  value: z.string(),
  type: z.enum(['prompt', 'tag', 'track', 'album', 'playlist', 'artist']),
  field: z.string(),
  id: z.string(),
  multiple: z.boolean(),
})

export const autocompleteRawResponseSchema = z.object({
  suggestions: z.nullable(z.array(suggestionSchema)),
  totals: totalsSchema,
})

const autocompleteResponseSchema = z.object({
  suggestions: z.array(suggestionSchema),
  totals: totalsSchema,
})

export type AutocompleteResponse = z.infer<typeof autocompleteResponseSchema>
