import { EMPTY_FORM_VALUES } from '@features/bookings/constants'
import { useBookingsStore } from '@features/bookings/store/useBookingsStore'
import type { Booking } from '@features/bookings/types/booking'
import {
  bookingFormSchema,
  type BookingFormData,
} from '@features/bookings/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { hasOverlap } from '@shared/utils/dateOverlap'
import { useForm, useWatch } from 'react-hook-form'

type BookingFormProps = {
  editingId: string | null
  onCancelEdit: () => void
}

export function BookingForm({ editingId, onCancelEdit }: BookingFormProps) {
  const { bookings, addBooking, updateBooking, getBookingById } =
    useBookingsStore()
  const editing = editingId ? getBookingById(editingId) : null

  const defaultValues: BookingFormData = editing
    ? {
        startDate: editing.startDate,
        endDate: editing.endDate,
        guestName: editing.guestName,
        propertyName: editing.propertyName,
      }
    : EMPTY_FORM_VALUES

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  })

  const startDate = useWatch({
    control: form.control,
    name: 'startDate',
    defaultValue: '',
  })
  const endDateMin = startDate || ''

  const handleSubmit = form.handleSubmit((data) => {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (hasOverlap(bookings, start, end, editingId ?? undefined)) {
      form.setError('startDate', {
        message: 'These dates overlap with an existing booking',
      })
      return
    }

    if (editing) {
      updateBooking(editing.id, {
        startDate: data.startDate,
        endDate: data.endDate,
        guestName: data.guestName,
        propertyName: data.propertyName,
      })

      onCancelEdit()
    } else {
      const booking: Omit<Booking, 'id'> = {
        startDate: data.startDate,
        endDate: data.endDate,
        guestName: data.guestName,
        propertyName: data.propertyName,
      }

      addBooking(booking)
    }

    form.reset(EMPTY_FORM_VALUES)
  })

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editing ? 'Edit booking' : 'New booking'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium mb-1">
            Guest name
          </label>
          <input
            id="guestName"
            type="text"
            {...form.register('guestName')}
            className="w-full border rounded px-3 py-2"
          />
          {form.formState.errors.guestName && (
            <p role="alert" className="text-red-600 text-sm mt-1">
              {form.formState.errors.guestName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="propertyName"
            className="block text-sm font-medium mb-1"
          >
            Property
          </label>
          <input
            id="propertyName"
            type="text"
            {...form.register('propertyName')}
            className="w-full border rounded px-3 py-2"
          />
          {form.formState.errors.propertyName && (
            <p role="alert" className="text-red-600 text-sm mt-1">
              {form.formState.errors.propertyName.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-1"
            >
              Start date
            </label>
            <input
              id="startDate"
              type="date"
              {...form.register('startDate')}
              className="w-full border rounded px-3 py-2"
            />
            {form.formState.errors.startDate && (
              <p role="alert" className="text-red-600 text-sm mt-1">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End date
            </label>
            <input
              id="endDate"
              type="date"
              min={endDateMin || undefined}
              {...form.register('endDate')}
              className="w-full border rounded px-3 py-2"
            />
            {form.formState.errors.endDate && (
              <p role="alert" className="text-red-600 text-sm mt-1">
                {form.formState.errors.endDate.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-hostfully-green text-white rounded hover:opacity-90"
          >
            {editing ? 'Save' : 'Create'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border rounded hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
