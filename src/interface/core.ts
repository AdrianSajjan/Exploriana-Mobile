import { Nullable } from "@exploriana/interface/helper";

export interface User {
  name: string;
  email: string;
}

export interface Transport {
  id: string;
  name: string;
  price: number;
  timeOfDeparture: Date;
  placeOfDeparture: string;
  timeOfArrival: Date;
  placeOfArrival: string;
}

export interface Schedule {
  dateOfDeparture: Date;
  placeOfDeparture: string;
  placeOfArrival: string;
  dateOfReturn: Nullable<Date>;
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
