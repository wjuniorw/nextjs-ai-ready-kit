import { z } from 'zod'

export const SessionResponseSchema = z.object({
  id: z.string(),
  expiresAt: z.string(),
  metadata: z.object({
    ip: z.string(),
    userAgent: z.string(),
    createdAt: z.string()
  })
})

export type SessionResponseDto = z.infer<typeof SessionResponseSchema>
