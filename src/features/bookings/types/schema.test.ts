import { describe, it, expect } from 'vitest'
import { bookingFormSchema } from './schema'
import { DEFAULT_PROPERTY_NAME } from '@features/bookings/constants'

const MOCK_VALID_FORM_DATA = {
  startDate: '2025-01-01',
  endDate: '2025-01-05',
  guestName: 'Krasimir',
  propertyName: DEFAULT_PROPERTY_NAME,
} as const

describe('bookingFormSchema', () => {
  it('returns valid data for correct input', () => {
    const result = bookingFormSchema.safeParse(MOCK_VALID_FORM_DATA)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toMatchObject(MOCK_VALID_FORM_DATA)
    }
  })

  it('fails when endDate is before startDate', () => {
    const result = bookingFormSchema.safeParse({
      ...MOCK_VALID_FORM_DATA,
      startDate: '2025-01-05',
      endDate: '2025-01-01',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('endDate')
    }
  })

  it('fails when guestName is empty', () => {
    const result = bookingFormSchema.safeParse({
      ...MOCK_VALID_FORM_DATA,
      guestName: '',
    })
    expect(result.success).toBe(false)
  })

  it('trims guestName and propertyName', () => {
    const result = bookingFormSchema.safeParse({
      ...MOCK_VALID_FORM_DATA,
      guestName: '  John Doe  ',
      propertyName: '  Beach House  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.guestName).toBe('John Doe')
      expect(result.data.propertyName).toBe('Beach House')
    }
  })

  it('fails when guestName exceeds max length', () => {
    const result = bookingFormSchema.safeParse({
      ...MOCK_VALID_FORM_DATA,
      guestName: 'a'.repeat(201),
    })
    expect(result.success).toBe(false)
  })
})
