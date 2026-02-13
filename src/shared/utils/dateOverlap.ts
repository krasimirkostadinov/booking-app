import { areIntervalsOverlapping } from 'date-fns'

type BookingWithDates = { startDate: string, endDate: string, id: string }

export function hasOverlap(
  bookings: BookingWithDates[],
  newStart: Date,
  newEnd: Date,
  excludeId?: string,
): boolean {
  const interval = { start: newStart, end: newEnd }

  return bookings.some(
    (b) =>
      b.id !== excludeId &&
      areIntervalsOverlapping(
        interval,
        { start: new Date(b.startDate), end: new Date(b.endDate) },
        { inclusive: false },
      ),
  )
}
