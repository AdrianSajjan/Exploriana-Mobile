import { Schedule } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface ScheduleState {
  details: Nullable<Schedule>;
  update: (data: Schedule) => void;
}

export const useScheduleStore = create<ScheduleState>()((set) => ({
  details: null,
  update: (data) => set({ details: data }),
}));
