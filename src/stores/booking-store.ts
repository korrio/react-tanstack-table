import { create } from "zustand";
import type { Booking } from "@/lib/booking-data";
export type { Booking } from "@/lib/booking-data";

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  updatingId: number | null;
  error: string | null;

  // Actions
  fetchBookings: () => Promise<void>;
  updateStatus: (id: number, status: Booking["status"]) => Promise<void>;
  confirmBooking: (id: number) => Promise<void>;
  cancelBooking: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  loading: false,
  updatingId: null,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = (await res.json()) as Booking[];
      set({ bookings: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },

  updateStatus: async (id, status) => {
    set({ updatingId: id, error: null });
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = (await res.json()) as Booking;

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: updated.status } : b
        ),
        updatingId: null,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        updatingId: null,
      });
    }
  },

  confirmBooking: async (id) => {
    await get().updateStatus(id, "confirmed");
  },

  cancelBooking: async (id) => {
    await get().updateStatus(id, "cancelled");
  },

  setError: (error) => set({ error }),
}));
