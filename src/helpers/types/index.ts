import { z } from 'zod'

export interface BySystemId {
  system_id: string
}

export interface ByClientId {
  client_id: string
}

export interface QueryParams {
  detailed?: boolean
}

export const countResponseSchema = z.object({
  length: z.number(),
})

export type CountResponse = z.infer<typeof countResponseSchema>

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type MessageResponse = z.infer<typeof messageResponseSchema>
