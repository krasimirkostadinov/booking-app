type BookingWithDates = { startDate: string; endDate: string; id: string }

function intervalsOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean {
  return start1.getTime() < end2.getTime() && start2.getTime() < end1.getTime()
}

export function hasOverlap(
  bookings: BookingWithDates[],
  newStart: Date,
  newEnd: Date,
  excludeId?: string,
): boolean {
  return bookings.some(
    (b) =>
      b.id !== excludeId &&
      intervalsOverlap(
        newStart,
        newEnd,
        new Date(b.startDate),
        new Date(b.endDate),
      ),
  )
}
