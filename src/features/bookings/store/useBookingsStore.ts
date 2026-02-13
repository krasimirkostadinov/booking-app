import type { Booking } from "@features/bookings/types/booking";
import { STORAGE_KEY } from "@features/bookings/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type BookingsStore = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id">) => void;
  updateBooking: (id: string, booking: Partial<Omit<Booking, "id">>) => void;
  deleteBooking: (id: string) => void;
  getBookingById: (id: string) => Booking | undefined;
};

export const useBookingsStore = create<BookingsStore>()(
  persist(
    (set, get) => ({
      bookings: [] as Booking[],
      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            ...state.bookings,
            { ...booking, id: crypto.randomUUID() },
          ],
        })),
      updateBooking: (id, updates) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        })),
      deleteBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        })),
      getBookingById: (id) => get().bookings.find((b) => b.id === id),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
