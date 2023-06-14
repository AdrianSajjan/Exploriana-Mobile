import { Geocode, ReverseGeocode } from "@exploriana/interface/api";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface WeatherState {
  selected: Nullable<ReverseGeocode | Geocode>;
  update: (data: ReverseGeocode | Geocode) => void;
}

export const useWeatherStore = create<WeatherState>()((set) => ({
  selected: null,
  update: (data) => set({ selected: data }),
}));
