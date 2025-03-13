import { z } from 'zod'
interface VideosListRequestParams {
  part: string
  id: string
}

type VideosListRequest = (params: VideosListRequestParams) => Promise<VideosListResponse>

const videoThumbnailSchema = z.optional(
  z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }),
)

const videoItemSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  id: z.string(),
  snippet: z.object({
    publishedAt: z.string(),
    channelId: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnails: z.object({
      default: videoThumbnailSchema,
      medium: videoThumbnailSchema,
      high: videoThumbnailSchema,
      standard: videoThumbnailSchema,
      maxres: videoThumbnailSchema,
    }),
    channelTitle: z.string(),
    tags: z.optional(z.array(z.string())),
    categoryId: z.string(),
    liveBroadcastContent: z.string(),
    defaultLanguage: z.optional(z.string()),
    localized: z.object({
      title: z.string(),
      description: z.string(),
    }),
    defaultAudioLanguage: z.optional(z.string()),
  }),
  contentDetails: z.object({
    duration: z.string(),
    dimension: z.string(),
    definition: z.string(),
    caption: z.string(),
    licensedContent: z.boolean(),
    // FIXME remove any
    contentRating: z.record(z.any()),
    projection: z.string(),
  }),
  player: z.object({
    embedHtml: z.string(),
  }),
})

const videosListResponseSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  items: z.array(videoItemSchema),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
})

const rootURL = 'https://youtube.googleapis.com/youtube/v3'
type VideosListResponse = z.infer<typeof videosListResponseSchema>
class YouTubeDataAPI {
  private readonly apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private readonly videosList: VideosListRequest = async (
    params: VideosListRequestParams,
  ): Promise<VideosListResponse> => {
    const { id, part } = params
    const response = await fetch(
      `${rootURL}/videos?part=${encodeURIComponent(part)}&id=${encodeURIComponent(id)}&key=${this.apiKey}`,
    )
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const responseData = await response.json()
    const parserResponse = videosListResponseSchema.safeParse(responseData)
    if (!parserResponse.success) {
      throw new Error('Data does not corresponds with schema')
    }
    return parserResponse.data
  }

  public readonly videos = {
    list: this.videosList,
    // TODO: support more endpoints
  }
}

export { YouTubeDataAPI }
