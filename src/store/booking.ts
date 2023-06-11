import { Booking } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface BookingState {
  selected: Nullable<Booking>;
  update: (data: Booking) => void;
}

export const useBookingStore = create<BookingState>()((set) => ({
  selected: null,
  update: (data) => set({ selected: data }),
}));
