import { parse, toSeconds } from 'iso8601-duration'

export const iso8601ToSeconds = (duration: string): number => toSeconds(parse(duration))

// Announcement: removes characters before link
export const extractCleanLink = (text: string) => {
  const indexOfHTTP = text.toLowerCase().indexOf('http')
  return indexOfHTTP > -1 ? text.slice(indexOfHTTP) : text
}
