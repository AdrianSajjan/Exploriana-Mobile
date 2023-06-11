export interface Tours {
  id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingAverage: number;
  ratingQuantity: number;
  rating: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;
  startLocation: StartLocation;
  locations: Location[];
  guides: string[];
  slug: string;
  __v: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export interface CreatedAt {
  $date: Date;
}

export interface Location {
  type: Type;
  coordinates: number[];
  description: string;
  day: number;
  id: string;
}

export enum Type {
  Point = "Point",
}

export interface StartLocation {
  type: Type;
  coordinates: number[];
  address: string;
  description: string;
}
