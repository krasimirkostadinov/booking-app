import { beforeEach, describe, expect, it } from 'vitest'
import { useBookingsStore } from './useBookingsStore'
import { DEFAULT_PROPERTY_NAME } from '@features/bookings/constants'

const GUEST_NAME = 'Krasimir' as const

describe('useBookingsStore', () => {
  beforeEach(() => {
    useBookingsStore.setState({ bookings: [] })
  })

  it('addBooking adds a booking', () => {
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: GUEST_NAME,
      propertyName: DEFAULT_PROPERTY_NAME,
    })
    const { bookings } = useBookingsStore.getState()
    expect(bookings).toHaveLength(1)
    expect(bookings[0].guestName).toBe(GUEST_NAME)
  })

  it('updateBooking updates a booking', () => {
    const { addBooking, updateBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: GUEST_NAME,
      propertyName: DEFAULT_PROPERTY_NAME,
    })
    const id = useBookingsStore.getState().bookings[0].id
    updateBooking(id, { guestName: 'Jane' })
    expect(useBookingsStore.getState().bookings[0].guestName).toBe('Jane')
  })

  it('deleteBooking removes a booking', () => {
    const { addBooking, deleteBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: GUEST_NAME,
      propertyName: DEFAULT_PROPERTY_NAME,
    })
    const id = useBookingsStore.getState().bookings[0].id
    deleteBooking(id)
    expect(useBookingsStore.getState().bookings).toHaveLength(0)
  })

  it('getBookingById returns booking when found', () => {
    const { addBooking, getBookingById } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: GUEST_NAME,
      propertyName: DEFAULT_PROPERTY_NAME,
    })
    const id = useBookingsStore.getState().bookings[0].id
    const found = getBookingById(id)
    expect(found?.guestName).toBe(GUEST_NAME)
  })

  it('getBookingById returns undefined when not found', () => {
    const { getBookingById } = useBookingsStore.getState()
    expect(getBookingById('unknown-id')).toBeUndefined()
  })
})
