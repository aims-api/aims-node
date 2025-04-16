import { AxiosInstance } from 'axios'
import { z } from 'zod'
import { API_VERSION } from '../../consts'
import { Response, parseError, successResponse } from '../../helpers/apiResponse'

const conversionSchema = z.enum([
  'track_download',
  'track_similar',
  'track_add_to_project',
  'track_like',
  'track_dislike',
  'track_play',
  'album_download',
  'track_is_similar',
  'track_is_not_similar',
])

type Conversion = z.infer<typeof conversionSchema>

const responseSchema = z.object({
  message: z.string(),
})

type ConversionResponse = z.infer<typeof responseSchema>

// ANNOUNC: this type is used only by /src/client/index.ts endpoints
interface RequestData {
  id_client: string // uuid
  type: Conversion
  query_id: string // uuid
}

const conversion =
  (client: () => AxiosInstance) =>
  async (data: RequestData): Promise<Response<ConversionResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/feedback/conversion`, data)
      const parserResponse = responseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { conversion, type Conversion, type RequestData }
