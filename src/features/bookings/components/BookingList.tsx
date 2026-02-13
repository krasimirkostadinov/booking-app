import { useBookingsStore } from '@features/bookings/store/useBookingsStore'
import { formatDate } from '@shared/utils/formatDate'

type BookingListProps = {
  onEdit: (id: string) => void
}

export function BookingList({ onEdit }: BookingListProps) {
  const { bookings, deleteBooking } = useBookingsStore()

  if (!bookings?.length) {
    return (
      <section aria-labelledby="bookings-heading">
        <h2 id="bookings-heading" className="text-lg sm:text-xl font-semibold mb-4">Bookings</h2>
        <p className="text-slate-600 text-sm sm:text-base">
          No bookings yet. Create one above.
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="bookings-heading">
      <h2 id="bookings-heading" className="text-lg sm:text-xl font-semibold mb-4">Bookings</h2>
      <ul className="space-y-3 sm:space-y-4">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 border border-hostfully-green/20 rounded-lg bg-slate-50"
          >
            <article className="min-w-0 flex-1">
              <p className="font-medium">{b.guestName}</p>
              <p className="text-sm text-slate-600 mt-0.5">{b.propertyName}</p>
              <p className="text-sm text-slate-600 mt-0.5">
                {formatDate(new Date(b.startDate))} – {formatDate(new Date(b.endDate))}
              </p>
            </article>
            <div className="flex gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={() => onEdit(b.id)}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 text-sm border border-hostfully-green/40 text-hostfully-blue rounded hover:bg-hostfully-green/10 min-h-[44px] sm:min-h-0"
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
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 text-sm border border-red-200 text-red-700 rounded hover:bg-red-50 min-h-[44px] sm:min-h-0"
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
