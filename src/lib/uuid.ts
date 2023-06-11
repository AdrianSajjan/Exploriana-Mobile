import { nanoid, customAlphabet } from "nanoid";
import utils from "lodash";

const random = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 7);
const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function createBookingID() {
  return nanoid();
}

export function createTransportNumber() {
  return random();
}

export function createSeatNumber() {
  return utils.sample(alphabets)! + utils.sample(numbers)!;
}
