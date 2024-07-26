import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'

type Request = { data?: { link: string; type: number } }

type WaveformResponse = ArrayBuffer

const getWaveform =
  (client: (configOverride: AxiosRequestConfig) => AxiosInstance) =>
  async (request: Request): Promise<Response<WaveformResponse>> => {
    try {
      const response = await client({ responseType: 'arraybuffer' }).post(
        `/${API_VERSION}/waveform/by-url`,
        request.data,
      )
      return successResponse(response.data)
    } catch (error) {
      return parseError(error)
    }
  }

export { getWaveform }
