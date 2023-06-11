import { hereSDKReverseGeocode } from "@exploriana/config/api";
import { ReverseGeocode } from "@exploriana/interface/api";
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
