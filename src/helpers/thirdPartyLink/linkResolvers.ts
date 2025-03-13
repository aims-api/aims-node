import { fetchSong, fetchToken } from 'node-apple-music'
import SpotifyWebApi from 'spotify-web-api-node'
// TODO: vimeo deprecated, upgrade to https://www.npmjs.com/package/@vimeo/vimeo
import { type RequestOptions, Vimeo } from 'vimeo'
import { z } from 'zod'
import { Request as Payload } from '../../endpoints/link-info/get'
import { type LinkInfo, type LinkSource, LinkSources } from '../types/linkInfo'
import { YouTubeDataAPI } from './YouTubeDataAPI'
import { isSupportedStreamingServiceLink, iso8601ToSeconds } from './utils'

const youTubeIdResolver = (link: URL): string => {
  const QUERY_PARAMETER_VIDEO_ID = 'v'
  const SHORT_HOST = 'youtu.be'
  const EMBED_PATH_SEGMENT = '/embed/'
  const SHORTS_PATH_SEGMENT = '/shorts/'
  const SHORT_PATH_MATCHING_REGEXP = /^\/?([a-z0-9_-]+)\/?.*$/i
  const EMBED_PATH_MATCHING_REGEXP = /^\/embed\/([a-z0-9_-]+)\/?.*$/i
  const SHORTS_PATH_MATCHING_REGEXP = /^\/shorts\/([a-z0-9_-]+)\/?.*$/i
  const STEMMING_REGEXP = /(\/)(feeds|api|videos|vi)\//i
  const GUESS_IDENTIFIER_MATCHING_REGEXP = /^\/?([a-z0-9_-]{8,12})\/?.*$/i

  const isHostShort = (host: string): boolean => host.includes(SHORT_HOST)

  const isEmbed = (path: string): boolean => path.includes(EMBED_PATH_SEGMENT)

  const isShorts = (path: string): boolean => path.includes(SHORTS_PATH_SEGMENT)

  const stemPath = (path: string): string => {
    let previousPath = path
    // expressions are overlapping (and they should stay that way), regexp may need to be applied several times
    while (true) {
      const stemmedPath = previousPath.replace(STEMMING_REGEXP, '$1')
      if (stemmedPath === previousPath) {
        return stemmedPath
      }
      previousPath = stemmedPath
    }
  }

  const guessIdentifier = (path: string): string => {
    const stemmedPath = stemPath(path)
    const guessedIdentifier = stemmedPath.replace(GUESS_IDENTIFIER_MATCHING_REGEXP, '$1')
    if (stemmedPath === guessedIdentifier) {
      throw Error('The URL has invalid format')
    }
    return guessedIdentifier
  }

  if (link.searchParams.has(QUERY_PARAMETER_VIDEO_ID)) {
    const identifier = link.searchParams.get(QUERY_PARAMETER_VIDEO_ID)
    if (identifier === null || identifier.length <= 0) {
      throw Error('The URL has invalid format')
    }
    if (identifier.match(/\s/) !== null) {
      throw Error('The URL does not contain a valid ID')
    }
    return identifier
  }
  const host = link.hostname
  const path = link.pathname
  if (isHostShort(host)) {
    return path.replace(SHORT_PATH_MATCHING_REGEXP, '$1')
  }
  if (isEmbed(path)) {
    return path.replace(EMBED_PATH_MATCHING_REGEXP, '$1')
  }
  if (isShorts(path)) {
    return path.replace(SHORTS_PATH_MATCHING_REGEXP, '$1')
  }
  return guessIdentifier(path)
}

const vimeoIdResolver = (link: URL): string => {
  const VIDEO_MATCHING_REGEXP = /^.*\/videos?\/([0-9]+).*$/i
  const IDENTIFIER_MATCHING_REGEXP = /^.*\/([0-9]+)\/?$/i

  const isValidPath = (path: string): boolean => path.match(VIDEO_MATCHING_REGEXP) !== null

  const endsWithIdentifier = (path: string): boolean => path.match(IDENTIFIER_MATCHING_REGEXP) !== null

  const path = link.pathname
  if (isValidPath(path)) {
    return path.replace(VIDEO_MATCHING_REGEXP, '$1')
  }
  if (endsWithIdentifier(path)) {
    return path.replace(IDENTIFIER_MATCHING_REGEXP, '$1')
  }
  throw Error('The URL has invalid format')
}

const soundCloudIdResolver = (link: URL): string => {
  const HOST_MATCHING_REGEXP = /^(www\.)?(on\.)?soundcloud\.com$/i
  const INVALID_RESOURCE_TYPE_MATCHING_REGEXP = /^\/(search$|([^/]+)\/sets\/)/i
  const API_MATCHING_REGEXP = /^.*\/tracks\/([0-9]+)\/?$/i
  const EMPTY_IDENTIFIER = '/'
  const QUERY_PARAMETER_URL = 'url'

  const isMainHost = (host: string): boolean => host.match(HOST_MATCHING_REGEXP) !== null

  const isInvalidResourcePath = (path: string): boolean => path.match(INVALID_RESOURCE_TYPE_MATCHING_REGEXP) !== null

  const isTrackPath = (path: string): boolean => path.match(API_MATCHING_REGEXP) !== null

  const host = link.hostname
  const path = link.pathname

  if (isMainHost(host)) {
    if (isInvalidResourcePath(path)) {
      throw Error("The URL doesn't lead to a track but to a playlist, album or similar resource")
    }
    if (EMPTY_IDENTIFIER === path) {
      throw Error('The URL has invalid format')
    }
    return path
  }
  if (link.searchParams.has(QUERY_PARAMETER_URL)) {
    return soundCloudIdResolver(new URL(decodeURIComponent(link.searchParams.get(QUERY_PARAMETER_URL) as string)))
  }
  if (isTrackPath(path)) {
    return path.replace(API_MATCHING_REGEXP, '$1')
  }
  throw Error('The URL has invalid format')
}

const tikTokIdResolver = (link: URL): string => {
  const VIDEO_MATCHING_REGEXP = /^\/@[^/]+\/video\/(\d+).*$/i

  const isVideoPath = (path: string): boolean => path.match(VIDEO_MATCHING_REGEXP) !== null

  const path = link.pathname
  if (!isVideoPath(path)) {
    throw Error('The URL has invalid format')
  }
  return path.replace(VIDEO_MATCHING_REGEXP, '$1')
}

const appleMusicIdResolver = (link: URL): string => {
  const TRACK_MATCHING_REGEXP = /^\/(?:[a-z]+\/)?album\/(?:.+\/)?(\d+).*$/i

  const isTrackPath = (link: URL): boolean =>
    link.pathname.match(TRACK_MATCHING_REGEXP) !== null && link.searchParams.get('i')?.match(/^\d+$/) !== null

  if (!isTrackPath(link)) {
    throw Error('The URL has invalid format')
  }
  return link.searchParams.get('i') as string
}

const spotifyIdResolver = (link: URL): string => {
  const TRACK_MATCHING_REGEXP = /^\/(embed\/)?(intl-[a-z]{2}\/)?track\/([0-9A-Za-z\-_]+).*$/i
  const ARTIST_MATCHING_REGEXP = /^\/(embed\/)?(intl-[a-z]{2}\/)?artist\/([0-9A-Za-z\-_]+).*$/i
  const path = link.pathname

  if (path.match(TRACK_MATCHING_REGEXP) !== null) {
    return path.replace(TRACK_MATCHING_REGEXP, '$3')
  }
  if (path.match(ARTIST_MATCHING_REGEXP) !== null) {
    return path.replace(ARTIST_MATCHING_REGEXP, '$3')
  }
  throw Error('The URL has invalid format')
}

const idResolvers = {
  [LinkSources.APPLE_MUSIC]: appleMusicIdResolver,
  [LinkSources.SOUNDCLOUD]: soundCloudIdResolver,
  [LinkSources.SPOTIFY]: spotifyIdResolver,
  [LinkSources.TIKTOK]: tikTokIdResolver,
  [LinkSources.VIMEO]: vimeoIdResolver,
  [LinkSources.YOUTUBE]: youTubeIdResolver,
}

const resolveId = (link: URL, type: LinkSource): string => {
  const idResolver = idResolvers[type]
  if (typeof idResolver === 'undefined') {
    throw Error('ID can not be resolved for this service')
  }
  return idResolver(link)
}

const rawInfoSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  items: z.array(z.unknown()),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
})

const youTubeProcessor = async (link: URL, credentials: AuthPayload): Promise<LinkInfo> => {
  const id = resolveId(link, LinkSources.YOUTUBE)
  const part = 'snippet,contentDetails,player'

  if (typeof credentials !== 'string') {
    throw Error('Provide credentials for YouTube API')
  }
  const youtubeApi = new YouTubeDataAPI(credentials)
  const rawInfo = await youtubeApi.videos.list({ id, part })
  const parserResponse = rawInfoSchema.safeParse(rawInfo)

  if (!parserResponse.success) {
    throw Error('Error while parsing response from API')
  }

  if (parserResponse.data.items.length === 0) {
    throw Error('Error while parsing response from API')
  }

  if (rawInfo.items[0] === undefined) {
    throw Error('Youtube video was not retrieved')
  }

  const video = rawInfo.items[0]

  return {
    audioUrl: null,
    description: video.snippet.description,
    duration: iso8601ToSeconds(video.contentDetails.duration),
    embed: video.player.embedHtml,
    id: video.id,
    thumbnail: video.snippet.thumbnails.default?.url,
    title: video.snippet.title,
    type: LinkSources.YOUTUBE,
  }
}
const authenticateVimeo = async (vimeoApi: Vimeo): Promise<string> => {
  return await new Promise((resolve, reject) => {
    vimeoApi.generateClientCredentials('public', (err, response): void => {
      if (err !== null) {
        reject(err)
      }
      resolve(response.access_token)
    })
  })
}

// biome-ignore lint/suspicious/noExplicitAny: types missing
const queryVimeo = async (id: string, vimeoApi: Vimeo): Promise<Record<string, any>> => {
  return await new Promise((resolve, reject) => {
    const options: RequestOptions = {
      path: `/videos/${id}`,
      method: 'GET',
      query: {
        fields: 'name,description,embed,pictures,duration',
      },
    }
    vimeoApi.request(options, (err, body, statusCode) => {
      if (err !== null) {
        reject(err)
      }
      if (typeof statusCode === 'undefined' || statusCode > 200) {
        reject(body)
      }
      resolve(body)
    })
  })
}

const vimeoProcessor = async (link: URL, credentials: AuthPayload): Promise<LinkInfo> => {
  if (credentials == null || typeof credentials === 'string') {
    throw Error('Provide credentials for Spotify API')
  }
  const vimeoApi = new Vimeo(credentials.clientId, credentials.clientSecret)
  const id = resolveId(link, LinkSources.VIMEO)
  const token = await authenticateVimeo(vimeoApi)
  vimeoApi.setAccessToken(token)
  const rawInfo = await queryVimeo(id, vimeoApi)
  return {
    audioUrl: null,
    description: rawInfo.description,
    duration: rawInfo.duration,
    embed: rawInfo.embed.html,
    id,
    thumbnail: rawInfo.pictures.sizes.reverse()[0].link,
    title: rawInfo.name,
    type: LinkSources.VIMEO,
  }
}

const soundCloudProcessor = async (link: URL, credentials: AuthPayload): Promise<LinkInfo> => {
  const id = resolveId(link, LinkSources.SOUNDCLOUD)

  let url = link.toString()

  if (link.hostname.startsWith('on.')) {
    const redirect = await fetch(url)
    url = redirect.url
  }

  if (typeof credentials !== 'string') {
    throw Error('Provide credentials for SoundCloud API')
  }
  const response = await fetch(
    `https://api-widget.soundcloud.com/resolve?url=${encodeURIComponent(url)}&format=json&client_id=${credentials}`,
  )
  if (!response.ok) {
    throw Error('Can not fetch link information')
  }
  // FIXME: check types using zod
  // biome-ignore lint/suspicious/noExplicitAny: types missing
  const rawInfo: any = await response.json()
  const mediaUrl = rawInfo.media.transcodings.filter(
    // FIXME: check types using zod
    // biome-ignore lint: TODO
    (item: Record<string, any>) => item.format.mime_type === 'audio/mpeg' && item.format.protocol !== 'hls',
  )[0]?.url
  if (mediaUrl === undefined || mediaUrl === null) {
    throw Error('There is no streaming version available for this track')
  }
  const streamUrlResponse = await fetch(`${mediaUrl as string}?client_id=${process.env.SOUNDCLOUD_CLIENT_ID as string}`)
  if (!response.ok) {
    throw Error('Can not fetch streaming audio for this link')
  }
  // FIXME: check types using zod
  // biome-ignore lint/suspicious/noExplicitAny: types missing
  const streamUrl: any = await streamUrlResponse.json()
  return {
    audioUrl: streamUrl.url,
    description: rawInfo.description,
    duration: Math.floor(rawInfo.duration / 1000),
    embed: `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(
      link.toString(),
    )}"></iframe>`,
    id,
    thumbnail: rawInfo.user.avatar_url,
    title: rawInfo.title,
    type: LinkSources.SOUNDCLOUD,
  }
}

const tikTokProcessor = async (link: URL, credentials: AuthPayload): Promise<LinkInfo> => {
  const id = resolveId(link, LinkSources.TIKTOK)

  if (typeof credentials !== 'string') {
    throw Error('Provide credentials for TikTok API')
  }
  const TikAPI = require('tikapi').default
  const tikTokApi = TikAPI(credentials)
  const response = await tikTokApi.public.video({ id })
  if (!response.ok) {
    throw Error('Can not fetch link information')
  }
  const rawInfo = response.json
  return {
    audioUrl: rawInfo.itemInfo.itemStruct.music.playUrl,
    description: rawInfo.itemInfo.itemStruct.desc,
    duration: rawInfo.itemInfo.itemStruct.music.duration,
    embed: `<blockquote class="tiktok-embed" cite="${link.toString()}" data-video-id="${
      rawInfo.itemInfo.itemStruct.id as string
    }" style="max-width: 605px;min-width: 325px;" > <section> ${
      rawInfo.itemInfo.itemStruct.desc as string
    } </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`,
    id: rawInfo.itemInfo.itemStruct.id,
    thumbnail: rawInfo.itemInfo.itemStruct.music.coverThumb,
    title: rawInfo.itemInfo.itemStruct.music.title,
    type: LinkSources.TIKTOK,
  }
}

const appleMusicProcessor = async (link: URL, _credentials: AuthPayload): Promise<LinkInfo> => {
  // Announcement: credentials are not used, anonymous token is used

  const id = resolveId(link, LinkSources.APPLE_MUSIC)
  const countryCode = link.pathname.substring(1, 3)

  try {
    await fetchToken()
  } catch {
    throw Error('Apple Music API token is invalid')
  }

  const rawInfo = await fetchSong(id, { countryCode })

  return {
    audioUrl: rawInfo.attributes.previews[0].url,
    description: `from album ${rawInfo.attributes.albumName as string}`,
    duration: Math.floor(rawInfo.attributes.durationInMillis / 1000),
    embed: `<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="175" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/${
      link.pathname
    }?i=${rawInfo.attributes.id as string}"></iframe>`,
    id: rawInfo.id,
    thumbnail: rawInfo.attributes.artwork.url.replace(/\{([wh])}/gi, '200'),
    title: `${rawInfo.attributes.artistName as string} - ${rawInfo.attributes.name as string}`,
    type: LinkSources.APPLE_MUSIC,
  }
}

const spotifyProcessor = async (link: URL, credentials: AuthPayload): Promise<LinkInfo> => {
  const createSpotifyTrackLinkInfo = (track: SpotifyApi.SingleTrackResponse): LinkInfo => {
    return {
      audioUrl: track.preview_url,
      description: `from album ${track.album.name}`,
      duration: Math.floor(track.duration_ms / 1000),
      embed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${track.id}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
      id: track.id,
      thumbnail: track.album.images[0]?.url,
      title: `${track.artists.map((artist) => artist.name).join(', ')} - ${track.name}`,
      type: LinkSources.SPOTIFY,
    }
  }

  const createSpotifyArtistLinkInfo = (artist: SpotifyApi.SingleArtistResponse): LinkInfo => {
    return {
      audioUrl: null,
      description: `${artist.followers.total.toLocaleString()} followers`,
      duration: 0,
      embed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/${artist.id}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
      id: artist.id,
      thumbnail: artist.images[0]?.url,
      title: artist.name,
      type: LinkSources.SPOTIFY,
    }
  }

  const id = resolveId(link, LinkSources.SPOTIFY)

  if (credentials == null || typeof credentials === 'string') {
    throw Error('Provide credentials for Spotify API')
  }
  const spotifyApi = new SpotifyWebApi(credentials)

  const tokenResponse = await spotifyApi.clientCredentialsGrant()
  const token = tokenResponse.body.access_token

  spotifyApi.setAccessToken(token)

  // Check if it's an artist URL
  if (link.pathname.includes('/artist/')) {
    const artistInfo = await spotifyApi.getArtist(id)
    return createSpotifyArtistLinkInfo(artistInfo.body)
  }

  // Handle tracks as before
  const rawInfo = await spotifyApi.getTrack(id)
  let track = rawInfo.body

  if (track.preview_url !== null) {
    return createSpotifyTrackLinkInfo(track)
  }

  // if no preview_url, try searching by ISRC (if there is) or by artist and track name
  if (track.external_ids.isrc !== undefined) {
    const isrcInfo = await spotifyApi.search(`isrc:${track.external_ids.isrc}`, ['track'], { limit: 50 })

    if (isrcInfo.body.tracks !== undefined && isrcInfo.body.tracks.total > 0) {
      const tracks = isrcInfo.body.tracks.items.filter((item) => item.preview_url !== null)

      if (tracks.length > 0 && tracks[0] !== undefined) {
        track = tracks[0]
        return createSpotifyTrackLinkInfo(tracks[0])
      }
    }
  }

  if (track.artists[0] === undefined) {
    throw Error('Artist not found')
  }

  // if no preview_url, try searching by artist and track name
  const textInfo = await spotifyApi.search(`artist:${track.artists[0].name} track:${track.name}`, ['track'], {
    limit: 50,
  })

  if (textInfo.body.tracks !== undefined && textInfo.body.tracks.total > 0) {
    const tracks = textInfo.body.tracks.items.filter((item) => item.preview_url !== null)

    if (tracks.length > 0 && tracks[0] !== undefined) {
      track = tracks[0]
      return createSpotifyTrackLinkInfo(track)
    }
  }

  return createSpotifyTrackLinkInfo(track)
}

const processors = {
  [LinkSources.APPLE_MUSIC]: appleMusicProcessor,
  [LinkSources.SOUNDCLOUD]: soundCloudProcessor,
  [LinkSources.SPOTIFY]: spotifyProcessor,
  [LinkSources.TIKTOK]: tikTokProcessor,
  [LinkSources.VIMEO]: vimeoProcessor,
  [LinkSources.YOUTUBE]: youTubeProcessor,
}

const getLinkType = (link: string): LinkSource => {
  if (link.match(/(youtu\.be|youtube\.com|ytimg\.com)/i) !== null) {
    return LinkSources.YOUTUBE
  }
  if (link.match(/(vimeo\.com|vimeocdn\.com|vimeopro\.com)/i) !== null) {
    return LinkSources.VIMEO
  }
  if (link.match(/(tiktok\.com)/i) !== null) {
    return LinkSources.TIKTOK
  }
  if (link.match(/(open\.spotify\.com)/i) !== null) {
    return LinkSources.SPOTIFY
  }
  if (link.match(/(soundcloud\.com)/i) !== null) {
    return LinkSources.SOUNDCLOUD
  }
  if (link.match(/(music\.apple\.com)/i) !== null) {
    return LinkSources.APPLE_MUSIC
  }
  throw Error('The link is not supported')
}

type AuthPayload = undefined | string | { clientId: string; clientSecret: string }

const getLinkInfo = async (payload: Payload): Promise<LinkInfo> => {
  if (!isSupportedStreamingServiceLink(payload.link)) {
    throw Error('The link is not supported')
  }

  const linkType = getLinkType(payload.link)
  const processor = processors[linkType]

  if (typeof processor === 'undefined') {
    throw Error('The service hosting the audio is currently not supported')
  }

  const authCredentials: Record<LinkSource, AuthPayload> = {
    [LinkSources.APPLE_MUSIC]: undefined,
    [LinkSources.SOUNDCLOUD]: payload.SOUNDCLOUD_CLIENT_ID,
    [LinkSources.SPOTIFY]:
      payload.SPOTIFY_CLIENT_ID !== undefined && payload.SPOTIFY_CLIENT_SECRET !== undefined
        ? {
            clientId: payload.SPOTIFY_CLIENT_ID,
            clientSecret: payload.SPOTIFY_CLIENT_SECRET,
          }
        : undefined,
    [LinkSources.TIKTOK]: payload.TIKAPI_API_KEY,
    [LinkSources.VIMEO]:
      payload.VIMEO_CLIENT_ID !== undefined && payload.VIMEO_CLIENT_SECRET !== undefined
        ? {
            clientId: payload.VIMEO_CLIENT_ID,
            clientSecret: payload.VIMEO_CLIENT_SECRET,
          }
        : undefined,
    [LinkSources.YOUTUBE]: payload.YOUTUBE_API_KEY,
  }

  return await processor(new URL(payload.link), authCredentials[linkType])
}

export { getLinkInfo }
