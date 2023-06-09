import { Transport } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface TransportState {
  selected: Nullable<Transport>;
  update: (data: Transport) => void;
}

export const useTransportStore = create<TransportState>()((set) => ({
  selected: null,
  update: (data) => set({ selected: data }),
}));
