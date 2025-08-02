import { z } from 'zod'

export const reportCreateSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  problem: z.string().min(1, 'Problem is required'),
  solve: z.string().min(1, 'Solution is required'),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  date: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .refine((date) => !isNaN(date.getTime()), 'Invalid date')
    .default(() => new Date()),
  status: z
    .enum(['pending', 'in-progress', 'resolved', 'cancelled'])
    .default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
})

export const reportQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  sort: z.string().default('date').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z
    .enum(['pending', 'in-progress', 'resolved', 'cancelled'])
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
})

export type ReportCreate = z.infer<typeof reportCreateSchema>
export type ReportQuery = z.infer<typeof reportQuerySchema>
