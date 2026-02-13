import { z } from 'zod'
import { MAX_TEXT_LENGTH } from '@features/bookings/constants'

export const bookingFormSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    guestName: z
      .string()
      .trim()
      .min(1, 'Guest name is required')
      .max(MAX_TEXT_LENGTH, `Guest name must be at most ${MAX_TEXT_LENGTH} characters`),
    propertyName: z
      .string()
      .trim()
      .min(1, 'Property name is required')
      .max(MAX_TEXT_LENGTH, `Property name must be at most ${MAX_TEXT_LENGTH} characters`),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })

export type BookingFormData = z.infer<typeof bookingFormSchema>
