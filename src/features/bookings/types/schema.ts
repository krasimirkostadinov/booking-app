import { z } from 'zod'
import {
  LETTERS_SPACES_DASHES_REGEX,
  MAX_PROPERTY_LENGTH,
  MAX_TEXT_LENGTH,
} from '@features/bookings/constants'

export const bookingFormSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    guestName: z
      .string()
      .trim()
      .min(1, 'Guest name is required')
      .max(MAX_TEXT_LENGTH, `Guest name must be at most ${MAX_TEXT_LENGTH} characters`)
      .refine((val) => {
        LETTERS_SPACES_DASHES_REGEX.lastIndex = 0
        return !LETTERS_SPACES_DASHES_REGEX.test(val)
      }, {
        message: 'Guest name can only contain letters, spaces, and dashes',
      }),
    propertyName: z
      .string()
      .trim()
      .min(1, 'Property name is required')
      .max(MAX_PROPERTY_LENGTH, `Property must be at most ${MAX_PROPERTY_LENGTH} characters`)
      .refine((val) => {
        LETTERS_SPACES_DASHES_REGEX.lastIndex = 0
        return !LETTERS_SPACES_DASHES_REGEX.test(val)
      }, {
        message: 'Property can only contain letters, spaces, and dashes',
      }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })

export type BookingFormData = z.infer<typeof bookingFormSchema>
