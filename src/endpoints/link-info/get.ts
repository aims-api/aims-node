import { Response, parseError, successResponse } from '../../helpers/apiResponse'
import { getLinkInfo } from '../../helpers/thirdPartyLink/linkResolvers'
import { type LinkInfo } from '../../helpers/types/linkInfo'

export type Request = {
  link: string
  SOUNDCLOUD_CLIENT_ID?: string
  SPOTIFY_CLIENT_ID?: string
  SPOTIFY_CLIENT_SECRET?: string
  VIMEO_CLIENT_ID?: string
  VIMEO_CLIENT_SECRET?: string
  TIKAPI_API_KEY?: string
  YOUTUBE_API_KEY?: string
}

const get = async (request: Request): Promise<Response<LinkInfo>> => {
  try {
    const response = await getLinkInfo(request)
    return successResponse(response)
  } catch (error) {
    return parseError(error)
  }
}

export { get }
