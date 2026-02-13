import { BookingForm, BookingList, useStoreHydration } from '@features/bookings'
import { useCallback, useState } from 'react'

export function BookingsPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const hydrated = useStoreHydration()
  const handleCancelEdit = useCallback(() => setEditingId(null), [])

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-hostfully-blue">
        Booking Manager
      </h1>

      <BookingForm
        key={editingId ?? 'new'}
        editingId={editingId}
        onCancelEdit={handleCancelEdit}
      />

      <BookingList onEdit={setEditingId} />
    </div>
  )
}
