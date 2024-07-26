import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import { Metadata, QueryParams } from '../../helpers/types'
import {
  TrackDetailedResponse,
  trackDetailedResponseSchema,
  TrackResponse,
  trackResponseSchema,
} from '../../helpers/types/track'
import { ReadStream } from 'fs'
import FormData from 'form-data'

type Request = {
  track: ReadStream
  id_client: string
  track_name: string
  params?: QueryParams
  data?: Metadata
}

export const getFormData = (request: Request): FormData => {
  const data = new FormData()
  Object.entries(request).forEach(([key, value]) => {
    if (key === 'params') {
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item) => data.append(`${key}[]`, item))
      return
    }
    if (key === 'track') {
      data.append(key, value)
      return
    }
    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => {
        data.append(key, typeof item === 'string' ? item : `${item}`)
      })
      return
    }
    data.append(key, value)
  })
  return data
}

const addNewTrack =
  (client: () => AxiosInstance) =>
  async (request: Request): Promise<Response<TrackResponse | TrackDetailedResponse>> => {
    try {
      const data = getFormData(request)
      const response = await client().post(`/${API_VERSION}/tracks`, data, {
        params: request.params,
      })
      const parserResponse = request.params?.detailed
        ? trackDetailedResponseSchema.parse(response.data)
        : trackResponseSchema.parse(response.data)
      return successResponse(parserResponse)
    } catch (error) {
      return parseError(error)
    }
  }

export { addNewTrack }
