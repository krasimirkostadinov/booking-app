import {
  EMPTY_FORM_VALUES,
  LETTERS_SPACES_DASHES_REGEX,
  MAX_PROPERTY_LENGTH,
  MAX_TEXT_LENGTH,
} from '@features/bookings/constants'
import { useBookingsStore } from '@features/bookings/store/useBookingsStore'
import type { Booking } from '@features/bookings/types/booking'
import {
  bookingFormSchema,
  type BookingFormData,
} from '@features/bookings/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { hasOverlap } from '@shared/utils/dateOverlap'
import { Controller, useForm, useWatch } from 'react-hook-form'

const openDatePicker = (input: HTMLInputElement | null) => {
  if (!input) return
  if (typeof input.showPicker === 'function') {
    input.showPicker()
  } else {
    input.focus()
  }
}

const filterLettersSpacesAndDashes = (value: string) =>
  value.replace(LETTERS_SPACES_DASHES_REGEX, '')

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
    mode: 'onTouched',
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
    <section aria-labelledby="form-heading" className="mb-6 sm:mb-8">
      <h2 id="form-heading" className="text-lg sm:text-xl font-semibold mb-4">
        {editing ? 'Edit booking' : 'New booking'}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:gap-5 w-full max-w-md sm:max-w-lg"
        noValidate
      >
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 border-0 p-0 m-0">
          <legend className="sr-only">Guest and property details</legend>
          <div>
            <label htmlFor="guestName" className="block text-sm font-medium mb-1">
              Guest name
            </label>
          <Controller
            name="guestName"
            control={form.control}
            render={({ field }) => (
            <input
              id="guestName"
              type="text"
              {...field}
              onChange={(e) => field.onChange(filterLettersSpacesAndDashes(e.target.value))}
              maxLength={MAX_TEXT_LENGTH}
              aria-describedby={form.formState.errors.guestName ? 'guestName-error' : undefined}
              autoComplete="name"
              className="w-full border rounded px-3 py-2.5 sm:py-2 text-base min-h-[44px] sm:min-h-0"
            />
            )}
          />
          {form.formState.errors.guestName && (
            <p id="guestName-error" role="alert" className="text-red-600 text-sm mt-1">
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
          <Controller
            name="propertyName"
            control={form.control}
            render={({ field }) => (
              <input
                id="propertyName"
                type="text"
                {...field}
                onChange={(e) => field.onChange(filterLettersSpacesAndDashes(e.target.value))}
                maxLength={MAX_PROPERTY_LENGTH}
                aria-describedby={form.formState.errors.propertyName ? 'propertyName-error' : undefined}
                autoComplete="organization"
                className="w-full border rounded px-3 py-2.5 sm:py-2 text-base min-h-[44px] sm:min-h-0"
              />
            )}
          />
          {form.formState.errors.propertyName && (
            <p id="propertyName-error" role="alert" className="text-red-600 text-sm mt-1">
              {form.formState.errors.propertyName.message}
            </p>
          )}
          </div>
        </fieldset>
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 border-0 p-0 m-0">
          <legend className="sr-only">Booking dates</legend>
          <div
            className="cursor-pointer"
            onClick={(e) =>
              openDatePicker(e.currentTarget.querySelector<HTMLInputElement>('input[type="date"]'))
            }
          >
            <label htmlFor="startDate" className="block">
              <span className="block text-sm font-medium mb-1">Start date</span>
              <input
                id="startDate"
                type="date"
                {...form.register('startDate')}
                aria-describedby={form.formState.errors.startDate ? 'startDate-error' : undefined}
                className="w-full border rounded px-3 py-2.5 sm:py-2 text-base min-h-[44px] sm:min-h-0"
              />
            </label>
            {form.formState.errors.startDate && (
              <p id="startDate-error" role="alert" className="text-red-600 text-sm mt-1">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>
          <div
            className="cursor-pointer"
            onClick={(e) =>
              openDatePicker(e.currentTarget.querySelector<HTMLInputElement>('input[type="date"]'))
            }
          >
            <label htmlFor="endDate" className="block">
              <span className="block text-sm font-medium mb-1">End date</span>
              <input
                id="endDate"
                type="date"
                min={endDateMin || undefined}
                {...form.register('endDate')}
                aria-describedby={form.formState.errors.endDate ? 'endDate-error' : undefined}
                className="w-full border rounded px-3 py-2.5 sm:py-2 text-base min-h-[44px] sm:min-h-0"
              />
            </label>
            {form.formState.errors.endDate && (
              <p id="endDate-error" role="alert" className="text-red-600 text-sm mt-1">
                {form.formState.errors.endDate.message}
              </p>
            )}
          </div>
        </fieldset>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1">
          <button
            type="submit"
            disabled={!form.formState.isValid}
            className={`w-full sm:w-auto px-4 py-3 sm:py-2 text-white rounded min-h-[44px] sm:min-h-0 disabled:cursor-not-allowed ${
              form.formState.isValid
                ? 'bg-hostfully-green hover:opacity-90'
                : 'bg-slate-400'
            }`}
          >
            {editing ? 'Save' : 'Create'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 border rounded hover:bg-slate-100 min-h-[44px] sm:min-h-0"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
