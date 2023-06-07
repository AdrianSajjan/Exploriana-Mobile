import { Transport } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface TransportState {
  details: Nullable<Transport>;
  update: (data: Transport) => void;
}

export const useTransportStore = create<TransportState>()((set) => ({
  details: null,
  update: (data) => set({ details: data }),
}));
