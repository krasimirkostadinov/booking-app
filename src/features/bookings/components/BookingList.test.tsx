import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingList } from './BookingList'
import { useBookingsStore } from '../store/useBookingsStore'

describe('BookingList', () => {
  const onEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useBookingsStore.setState({ bookings: [] })
  })

  it('shows empty state when no bookings', () => {
    render(<BookingList onEdit={onEdit} />)
    expect(screen.getByText(/no bookings yet/i)).toBeInTheDocument()
  })

  it('renders list of bookings', () => {
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: 'Jane Doe',
      propertyName: 'Beach House',
    })

    render(<BookingList onEdit={onEdit} />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Beach House')).toBeInTheDocument()
    expect(screen.getByText(/jan 1, 2025/i)).toBeInTheDocument()
    expect(screen.getByText(/jan 5, 2025/i)).toBeInTheDocument()
  })

  it('calls onEdit with id when Edit is clicked', async () => {
    const user = userEvent.setup()
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: 'Jane',
      propertyName: 'Property',
    })
    const id = useBookingsStore.getState().bookings[0].id

    render(<BookingList onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /edit booking for jane/i }))

    expect(onEdit).toHaveBeenCalledWith(id)
  })

  it('deletes booking when Delete is clicked and confirmed', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: 'Jane',
      propertyName: 'Property',
    })

    render(<BookingList onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /delete booking for jane/i }))

    expect(confirmSpy).toHaveBeenCalledWith('Delete booking for Jane?')
    expect(useBookingsStore.getState().bookings).toHaveLength(0)
    confirmSpy.mockRestore()
  })

  it('does not delete when Delete is cancelled', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: 'Jane',
      propertyName: 'Property',
    })

    render(<BookingList onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /delete booking for jane/i }))

    expect(useBookingsStore.getState().bookings).toHaveLength(1)
    confirmSpy.mockRestore()
  })
})
