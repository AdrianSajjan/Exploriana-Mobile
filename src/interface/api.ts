export interface ReverseGeocode {
  type: "reverse-geocode";
  title: string;
  id: string;
  resultType: string;
  address: Address;
  position: Position;
  distance: number;
  mapView: MapView;
}

export interface Geocode {
  type: "geocode";
  title: string;
  id: string;
  resultType: string;
  address: Address;
  position: Position;
  access: Position[];
  mapView: MapView;
  categories: Category[];
  foodTypes: Category[];
  scoring: Scoring;
}

export interface PlacesByCategory {
  title: string;
  id: string;
  ontologyId: string;
  resultType: string;
  address: Address;
  position: Position;
  access: Access[];
  distance: number;
  categories: Category[];
  references: Reference[];
  foodTypes?: FoodType[];
  contacts: Contact[];
  openingHours?: OpeningHour[];
}

export interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  state: string;
  county: string;
  city: string;
  district: string;
  subdistrict: string;
  street: string;
  postalCode: string;
  houseNumber?: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface Access {
  lat: number;
  lng: number;
}

export interface Category {
  id: string;
  name: string;
  primary?: boolean;
}

export interface Reference {
  supplier: Supplier;
  id: string;
}

export interface Supplier {
  id: string;
}

export interface FoodType {
  id: string;
  name: string;
  primary?: boolean;
}

export interface Contact {
  phone: Phone[];
  fax: Fax[];
  www: WWW[];
  email: Email[];
}

export interface Phone {
  value: string;
}

export interface Fax {
  value: string;
}

export interface WWW {
  value: string;
}

export interface Email {
  value: string;
}

export interface OpeningHour {
  text: string[];
  isOpen: boolean;
  structured: Structured[];
}

export interface Structured {
  start: string;
  duration: string;
  recurrence: string;
}
export interface Position {
  lat: number;
  lng: number;
}

export interface MapView {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface Scoring {
  queryScore: number;
  fieldScore: FieldScore;
}

export interface FieldScore {
  city: number;
  streets: number[];
  houseNumber: number;
  placeName: number;
}
