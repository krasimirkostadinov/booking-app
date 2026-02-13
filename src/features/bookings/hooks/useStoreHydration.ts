import { useBookingsStore } from '@features/bookings/store/useBookingsStore'
import { useEffect, useState } from 'react'

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(() =>
    useBookingsStore.persist.hasHydrated(),
  )

  useEffect(() => {
    if (hydrated) return

    const unsub = useBookingsStore.persist.onFinishHydration(() =>
      setHydrated(true),
    )

    queueMicrotask(() => {
      setHydrated(useBookingsStore.persist.hasHydrated())
    })

    return unsub
  }, [hydrated])

  return hydrated
}
