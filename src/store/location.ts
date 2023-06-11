import { Geocode, ReverseGeocode } from "@exploriana/interface/api";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface LocationState {
  current: Nullable<ReverseGeocode | Geocode>;
  selected: Nullable<ReverseGeocode | Geocode>;
  updateCurrent: (data: ReverseGeocode | Geocode) => void;
  updateSelected: (data: ReverseGeocode | Geocode) => void;
}

export const useLocationStore = create<LocationState>()((set) => ({
  current: null,
  selected: null,
  updateSelected: (data) => set({ selected: data }),
  updateCurrent: (data) => set({ current: data }),
}));
