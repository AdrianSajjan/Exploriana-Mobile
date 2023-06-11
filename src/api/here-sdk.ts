import { hereSDKAutocomplete, hereSDKDiscover, hereSDKGeocode, hereSDKReverseGeocode } from "@exploriana/config/api";
import { Geocode, LocationAutocomplete, PlacesByCategory, ReverseGeocode } from "@exploriana/interface/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LocationObjectCoords } from "expo-location";

export function useReverseGeocodeQuery({ latitude, longitude }: Pick<LocationObjectCoords, "latitude" | "longitude">) {
  return useQuery(["reverse-geocode", { latitude, longitude }], async () => {
    const result = await hereSDKReverseGeocode.get<{ items: ReverseGeocode[] }>("", {
      params: {
        at: [latitude, longitude].join(","),
        limit: 1,
      },
    });
    return result.data.items[0];
  });
}

export function useReverseGeocode() {
  const mutation = useMutation({
    mutationFn: async ({ latitude, longitude }: Pick<LocationObjectCoords, "latitude" | "longitude">) => {
      const result = await hereSDKReverseGeocode.get<{ items: ReverseGeocode[] }>("", {
        params: {
          at: [latitude, longitude].join(","),
          limit: 1,
        },
      });
      return result.data.items[0];
    },
  });
  return { fetch: mutation.mutate, fetchAsync: mutation.mutateAsync, ...mutation };
}

export function useGeocoder() {
  const mutation = useMutation({
    mutationFn: async (query: string) => {
      const result = await hereSDKGeocode.get<{ items: Geocode[] }>("", {
        params: {
          q: query,
        },
      });
      return result.data.items[0];
    },
  });
  return { fetch: mutation.mutate, fetchAsync: mutation.mutateAsync, ...mutation };
}

export function useSearchPlacesByCategoryQuery({ latitude, longitude, query, radius = 5000 }: Pick<LocationObjectCoords, "latitude" | "longitude"> & { query: string; radius?: number }) {
  return useQuery(
    ["places-category", { latitude, longitude, query, radius }],
    async () => {
      const result = await hereSDKDiscover.get<{ items: PlacesByCategory[] }>("", {
        params: {
          in: `circle:${latitude},${longitude};r=${radius}`,
          q: query,
        },
      });
      return result.data.items;
    },
    {
      initialData: [],
    }
  );
}

export function useLocationAutocompleteQuery(query: string, limit = 5) {
  return useQuery(
    ["places-autocomplete", { query }],
    async () => {
      const result = await hereSDKAutocomplete.get<{ items: LocationAutocomplete[] }>("", {
        params: {
          q: query,
          limit,
        },
      });
      return result.data.items;
    },
    {
      initialData: [],
      enabled: query.trim().length >= 3,
    }
  );
}
