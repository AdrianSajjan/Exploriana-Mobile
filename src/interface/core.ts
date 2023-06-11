import { Nullable } from "@exploriana/interface/helper";

export interface User {
  name: string;
  email: string;
}
export interface Schedule {
  placeOfArrival: string;
  dateOfDeparture: string;
  placeOfDeparture: string;
  dateOfReturn: Nullable<string>;
}
export interface Transport {
  id: string;
  name: string;
  price: number;
  timeOfArrival: string;
  timeOfDeparture: string;
  placeOfArrival: string;
  placeOfDeparture: string;
  type: "flight" | "train" | "bus";
}

export interface Booking {
  id: string;
  transport: string;
  name: string;
  placeOfDeparture: string;
  placeOfArrival: string;
  dateOfDeparture: string;
  dateOfArrival: string;
  dateOfReturn: string | null;
  transportNumber: string | null;
  seat: string;
  transportID: string;
  price: number;
  createdAt: string;
}

export interface Location {
  city: string;
  state: string;
  district: string;
}

export interface State {
  code: string;
  name: string;
}

export interface Station {
  code: string;
  name: string;
  city: string;
}
