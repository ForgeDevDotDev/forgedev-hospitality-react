import { create } from 'zustand';

interface SearchState {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  city: string;
  minStars: number;
  selectedAmenities: string[];
  // BUG: currentPage is not reset when search params change
  // so navigating to page 3, then changing filters, still shows page 3
  currentPage: number;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (count: number) => void;
  setCity: (city: string) => void;
  setMinStars: (stars: number) => void;
  toggleAmenity: (amenity: string) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  checkIn: null,
  checkOut: null,
  guests: 2,
  city: '',
  minStars: 0,
  selectedAmenities: [],
  currentPage: 1,

  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  setCity: (city) => set({ city }),
  setMinStars: (minStars) => set({ minStars }),
  toggleAmenity: (amenity) =>
    set((state) => {
      const idx = state.selectedAmenities.indexOf(amenity);
      if (idx === -1) {
        return { selectedAmenities: [...state.selectedAmenities, amenity] };
      }
      return { selectedAmenities: state.selectedAmenities.filter((a) => a !== amenity) };
    }),
  setPage: (page) => set({ currentPage: page }),
  // BUG: reset() doesn't clear currentPage, so after resetting filters
  // the pagination still shows the old page
  reset: () =>
    set({
      checkIn: null,
      checkOut: null,
      guests: 2,
      city: '',
      minStars: 0,
      selectedAmenities: [],
      // FIXME: Should also reset currentPage to 1
    }),
}));
