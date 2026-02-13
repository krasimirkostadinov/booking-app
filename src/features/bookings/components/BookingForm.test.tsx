import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingForm } from './BookingForm'
import { useBookingsStore } from '../store/useBookingsStore'
import { DEFAULT_PROPERTY_NAME } from '../constants'

const MOCK_VALID_FORM_DATA = {
  guestName: 'John Doe',
  propertyName: DEFAULT_PROPERTY_NAME,
  startDate: '2025-02-01',
  endDate: '2025-02-05',
} as const

describe('BookingForm', () => {
  const onCancelEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useBookingsStore.setState({ bookings: [] })
  })

  it('renders form with all fields', () => {
    render(<BookingForm editingId={null} onCancelEdit={onCancelEdit} />)

    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/property/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('shows "New booking" heading when not editing', () => {
    render(<BookingForm editingId={null} onCancelEdit={onCancelEdit} />)
    expect(screen.getByRole('heading', { name: /new booking/i })).toBeInTheDocument()
  })

  it('shows "Edit booking" heading when editing', () => {
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: 'Jane',
      propertyName: 'Beach House',
    })
    const id = useBookingsStore.getState().bookings[0].id

    render(<BookingForm editingId={id} onCancelEdit={onCancelEdit} />)
    expect(screen.getByRole('heading', { name: /edit booking/i })).toBeInTheDocument()
  })

  it('submits valid booking and adds to store', async () => {
    const user = userEvent.setup()
    render(<BookingForm editingId={null} onCancelEdit={onCancelEdit} />)

    const guestInput = screen.getByLabelText(/guest name/i)
    const propertyInput = screen.getByLabelText(/^property$/i)
    const startInput = screen.getByLabelText(/start date/i)
    const endInput = screen.getByLabelText(/end date/i)

    await user.clear(guestInput)
    await user.type(guestInput, MOCK_VALID_FORM_DATA.guestName)
    await user.clear(propertyInput)
    await user.type(propertyInput, MOCK_VALID_FORM_DATA.propertyName)
    await user.clear(startInput)
    await user.type(startInput, MOCK_VALID_FORM_DATA.startDate)
    await user.clear(endInput)
    await user.type(endInput, MOCK_VALID_FORM_DATA.endDate)
    await user.click(screen.getByRole('button', { name: /create/i }))

    const { bookings } = useBookingsStore.getState()
    expect(bookings).toHaveLength(1)
    expect(bookings[0]).toMatchObject(MOCK_VALID_FORM_DATA)
  })

  it('shows validation error when guest name is empty', async () => {
    const user = userEvent.setup()
    render(<BookingForm editingId={null} onCancelEdit={onCancelEdit} />)

    await user.type(screen.getByLabelText(/property/i), MOCK_VALID_FORM_DATA.propertyName)
    await user.type(screen.getByLabelText(/start date/i), MOCK_VALID_FORM_DATA.startDate)
    await user.type(screen.getByLabelText(/end date/i), MOCK_VALID_FORM_DATA.endDate)
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows overlap error when dates overlap with existing booking', async () => {
    const user = userEvent.setup()
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-02-01',
      endDate: '2025-02-10',
      guestName: 'Existing',
      propertyName: 'Property',
    })

    render(<BookingForm editingId={null} onCancelEdit={onCancelEdit} />)

    await user.type(screen.getByLabelText(/guest name/i), 'New Guest')
    await user.type(screen.getByLabelText(/property/i), 'Property')
    await user.type(screen.getByLabelText(/start date/i), '2025-02-05')
    await user.type(screen.getByLabelText(/end date/i), '2025-02-15')
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByText(/overlap/i)).toBeInTheDocument()
    expect(useBookingsStore.getState().bookings).toHaveLength(1)
  })

  it('calls onCancelEdit when Cancel is clicked in edit mode', async () => {
    const user = userEvent.setup()
    const { addBooking } = useBookingsStore.getState()
    addBooking({
      startDate: '2025-01-01',
      endDate: '2025-01-05',
      guestName: 'Jane',
      propertyName: 'Beach House',
    })
    const id = useBookingsStore.getState().bookings[0].id

    render(<BookingForm editingId={id} onCancelEdit={onCancelEdit} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancelEdit).toHaveBeenCalledTimes(1)
  })
})
