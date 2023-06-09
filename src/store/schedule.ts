import { Schedule } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface ScheduleState {
  selected: Nullable<Schedule>;
  update: (data: Schedule) => void;
}

export const useScheduleStore = create<ScheduleState>()((set) => ({
  selected: null,
  update: (data) => set({ selected: data }),
}));
