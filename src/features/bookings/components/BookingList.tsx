import { useBookingsStore } from '@features/bookings/store/useBookingsStore'
import { format } from 'date-fns'

type BookingListProps = {
  onEdit: (id: string) => void
}

export function BookingList({ onEdit }: BookingListProps) {
  const { bookings, deleteBooking } = useBookingsStore()

  if (!bookings?.length) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">Bookings</h2>
        <p className="text-slate-600">No bookings yet. Create one above.</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      <ul className="space-y-3">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-2 p-4 border border-hostfully-green/20 rounded bg-slate-50"
          >
            <div className="min-w-0">
              <p className="font-medium">{b.guestName}</p>
              <p className="text-sm text-slate-600">{b.propertyName}</p>
              <p className="text-sm text-slate-600">
                {format(new Date(b.startDate), 'MMM d, yyyy')} –{' '}
                {format(new Date(b.endDate), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(b.id)}
                className="px-3 py-1 text-sm border border-hostfully-green/40 text-hostfully-blue rounded hover:bg-hostfully-green/10"
                aria-label={`Edit booking for ${b.guestName}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete booking for ${b.guestName}?`)) {
                    deleteBooking(b.id)
                  }
                }}
                className="px-3 py-1 text-sm border border-red-200 text-red-700 rounded hover:bg-red-50"
                aria-label={`Delete booking for ${b.guestName}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
