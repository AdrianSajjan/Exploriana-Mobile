export interface User {
  name: string;
  email: string;
}

export interface Schedule {
  id: string;
  name: string;
  price: number;
  timeOfDeparture: string;
  placeOfDeparture: string;
  timeOfArrival: string;
  placeOfArrival: string;
}
