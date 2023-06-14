import axios from "axios";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { hereSDKApiKey } from "@exploriana/config/here-sdk";
import { googleApiKey, weatherApiKey } from "@exploriana/config/app";

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

export const weatherSDK = axios.create({
  baseURL: "https://api.weatherapi.com/v1/forecast.json",
  params: {
    key: weatherApiKey,
  },
});

export const googleSDKPlaceSearch = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/textsearch/json",
  params: {
    key: googleApiKey,
  },
});

export const googleSDKPhotoSearch = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/place/photo",
  params: {
    key: googleApiKey,
  },
});
