import { z } from 'zod'

// Announcement: used to fill z.enum([...]) see https://github.com/colinhacks/zod/discussions/2125#discussioncomment-7452235
// biome-ignore lint/suspicious/noExplicitAny: types missing
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]]
}

export const LinkSources = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  SOUNDCLOUD: 'soundcloud',
  SPOTIFY: 'spotify',
  APPLE_MUSIC: 'apple',
  TIKTOK: 'tiktok',
} as const

export type LinkSource = (typeof LinkSources)[keyof typeof LinkSources]

export const linkInfoSchema = z.object({
  audioUrl: z.optional(z.nullable(z.string())),
  description: z.optional(z.nullable(z.string())),
  duration: z.number(),
  embed: z.optional(z.string()),
  id: z.string(), // Announcement: link id
  thumbnail: z.optional(z.string()),
  title: z.optional(z.string()),
  type: z.enum(getValues(LinkSources)),
})

export type LinkInfo = z.infer<typeof linkInfoSchema>
