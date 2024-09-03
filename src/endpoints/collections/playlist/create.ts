import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../../consts'
import { parseError, successResponse, Response } from '../../../helpers/apiResponse'
import z from 'zod'

const responseSchema = z.object({
  collection: z.object({
    id: z.string(),
    key: z.string(),
    processed_at: z.string(),
    updated_at: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    auto_tagging_output: z.record(z.any()).nullable().optional(),
  }),
})

export type CreatePlaylistResponse = z.infer<typeof responseSchema>

export type CreatePlaylistRequest = {
  user_id: string
  project_id?: string
  project_key?: string
  title?: string
  description?: string
  is_hidden?: boolean
}

export const createPlaylistFromProject =
  (client: () => AxiosInstance, by: 'by-key' | 'by-id') =>
  async (request: CreatePlaylistRequest): Promise<Response<CreatePlaylistResponse>> => {
    try {
      const projectIdentifier = request.project_id ? request.project_id : request.project_key
      const response = await client().post(
        `/${API_VERSION}/project/create-playlist/${by}/${projectIdentifier}`,
        request,
        {
          headers: { 'X-User-Id': request.user_id },
        },
      )
      console.log(response.data)
      const parserResponse = responseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      console.log(error)
      return parseError(error)
    }
  }
