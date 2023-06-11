import axios from "axios";
import { hereSDKApiKey } from "@exploriana/config/here-sdk";

export const stripe = axios.create({
  baseURL: "https://api.stripe.com",
});

export const hereSDKDiscover = axios.create({
  baseURL: "https://discover.search.hereapi.com/v1/discover",
  params: {
    apiKey: hereSDKApiKey,
  },
});

export const hereSDKGeocode = axios.create({
  baseURL: "https://geocode.search.hereapi.com/v1/geocode",
  params: {
    apiKey: hereSDKApiKey,
  },
});

export const hereSDKReverseGeocode = axios.create({
  baseURL: "https://revgeocode.search.hereapi.com/v1/revgeocode",
  params: {
    apiKey: hereSDKApiKey,
  },
});

export const hereSDKAutocomplete = axios.create({
  baseURL: "https://autocomplete.search.hereapi.com/v1/autocomplete",
  params: {
    apiKey: hereSDKApiKey,
  },
});
