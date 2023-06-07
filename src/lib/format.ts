import utils from "lodash/fp";
import { getLocales } from "expo-localization";

export function formatToIndianCurrency(value: number | string) {
  return getLocales()[0].currencySymbol + value.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
}

export function formatToIndianLocale(value: number | string) {
  return value.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
}

export function formatTimeInterval(interval: Duration) {
  return Object.entries(utils.omit(["seconds"])(interval))
    .filter(([_, value]) => [""] && value !== 0)
    .map(([suffix, value]) => value + suffix.charAt(0))
    .join(" ");
}
