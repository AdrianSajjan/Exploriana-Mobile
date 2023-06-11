import { Nullable } from "@exploriana/interface/helper";
import { create } from "zustand";

export interface User {
  fullName: string;
  phoneNumber: string;
}

export interface AuthState {
  user: Nullable<User>;
  update: (data: User) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  update: (data) => set({ user: data }),
}));
