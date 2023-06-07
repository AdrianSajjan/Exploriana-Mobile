import { Nullable } from "@exploriana/interface/helper";

export interface User {
  name: string;
  email: string;
}

export interface Transport {
  id: string;
  name: string;
  price: number;
  timeOfDeparture: string;
  placeOfDeparture: string;
  timeOfArrival: string;
  placeOfArrival: string;
}

export interface Schedule {
  dateOfDeparture: string;
  placeOfDeparture: string;
  placeOfArrival: string;
  dateOfReturn: Nullable<string>;
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
