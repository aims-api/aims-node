import { AxiosError } from 'axios'
import { ZodError } from 'zod'

type APIError = {
  code: number
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>
}

type Error = { success: false; error: ZodError | AxiosError | APIError }

export type Response<T> = { success: true; data: T } | Error

export const successResponse = <T>(data: T): Response<T> => ({
  success: true,
  data,
})

export const parseError = (error: unknown): Error => {
  if (error instanceof AxiosError || error instanceof ZodError) {
    return {
      success: false,
      error: error instanceof AxiosError ? error?.response?.data ?? error?.response?.data.message ?? error : error,
    }
  }
  throw error
}

export const emptyResultsResponse = {
  tracks: [],
  pagination: {
    item_count: 0,
    page: 1,
    page_size: 0,
    page_count: 0,
  },
}
