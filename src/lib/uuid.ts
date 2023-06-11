import { nanoid, customAlphabet } from "nanoid";

const transport = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 7);
const airplane = customAlphabet("1234567890", 4);
const alphabet = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1);
const number = customAlphabet("123456789", 1);

export function createBookingID() {
  return nanoid();
}

export function createTransportNumber() {
  return transport();
}

export function createSeatNumber() {
  return alphabet() + number();
}

export function createAirplaneID(icao: string) {
  return icao + "-" + airplane();
}
