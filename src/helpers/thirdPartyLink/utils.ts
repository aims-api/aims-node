import { parse, toSeconds } from 'iso8601-duration'

export const iso8601ToSeconds = (duration: string): number => toSeconds(parse(duration))
export const isSupportedStreamingServiceLink = (link: string): boolean =>
  link.match(
    /(youtu\.be|youtube\.com|ytimg\.com|vimeo\.com|vimeocdn\.com|vimeopro\.com|tiktok\.com|open\.spotify\.com|soundcloud\.com|music\.apple\.com)/i,
  ) !== null

// Announcement: removes characters before link
export const extractCleanLink = (text: string) => {
  const indexOfHTTP = text.toLowerCase().indexOf('http')
  return indexOfHTTP > -1 ? text.slice(indexOfHTTP) : text
}
