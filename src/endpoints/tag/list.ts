import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import { z } from 'zod'

const tagListResponseSchema = z.object({
  tags: z.object({
    genre: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    ),
    instrument: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    ),
    mood: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    ),
    usage: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    ),
    decade: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    ),
    vocals: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    ),
  }),
})

export type TagListResponse = z.infer<typeof tagListResponseSchema>

const listTags = (client: () => AxiosInstance) => async (): Promise<Response<TagListResponse>> => {
  try {
    const response = await client().get(`/${API_VERSION}/tags`)
    const parserResponse = tagListResponseSchema.parse(response.data)
    return successResponse(parserResponse)
  } catch (error) {
    return parseError(error)
  }
}

export { listTags }
