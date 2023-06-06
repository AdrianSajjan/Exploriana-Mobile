import { getLocales } from "expo-localization";

export function formatToIndianCurrency(value: number | string) {
  return getLocales().shift().currencySymbol + value.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
}

export function formatToIndianLocale(value: number | string) {
  return value.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
}
