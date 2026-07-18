import { create } from 'zustand';
import { propertiesApi } from '../api';

interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  phone?: string;
  email?: string;
  rooms?: Room[];
  amenities?: Amenity[];
}

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  roomNumber: string;
  floor?: number;
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

interface PropertiesState {
  properties: Property[];
  currentProperty: Property | null;
  loading: boolean;
  error: string | null;
  fetchProperties: (params?: Record<string, unknown>) => Promise<void>;
  searchProperties: (params: Record<string, unknown>) => Promise<void>;
  fetchProperty: (id: string) => Promise<void>;
  createProperty: (data: Record<string, unknown>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,

  fetchProperties: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await propertiesApi.list(params);
      set({ properties: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  searchProperties: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await propertiesApi.search(params);
      set({ properties: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProperty: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await propertiesApi.get(id);
      set({ currentProperty: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createProperty: async (data) => {
    try {
      const res = await propertiesApi.create(data);
      set((state) => ({ properties: [...state.properties, res.data.data] }));
      return res.data.data;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteProperty: async (id) => {
    try {
      await propertiesApi.delete(id);
      set((state) => ({ properties: state.properties.filter((p) => p.id !== id) }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
