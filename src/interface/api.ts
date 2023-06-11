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

export interface Category {
  id: string;
  name: string;
  primary: boolean;
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
