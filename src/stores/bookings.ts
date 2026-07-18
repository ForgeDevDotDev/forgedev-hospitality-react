import { create } from 'zustand';
import { bookingsApi } from '../api';

interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  numGuests: number;
  specialRequests?: string;
  room?: {
    id: string;
    name: string;
    property?: {
      id: string;
      name: string;
      city: string;
    };
  };
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchBookings: (params?: Record<string, unknown>) => Promise<void>;
  createBooking: (data: Record<string, unknown>) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  bookings: [],
  loading: false,
  error: null,

  fetchBookings: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await bookingsApi.list(params);
      set({ bookings: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createBooking: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await bookingsApi.create(data);
      set((state) => ({ bookings: [...state.bookings, res.data.data], loading: false }));
      return res.data.data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  cancelBooking: async (id) => {
    try {
      await bookingsApi.cancel(id);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: 'CANCELLED' } : b
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
