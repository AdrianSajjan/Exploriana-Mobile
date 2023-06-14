import { googleSDKPhotoSearch, googleSDKPlaceSearch } from "@exploriana/config/api";
import { useMutation } from "@tanstack/react-query";

export function useGooglePlaceSearch() {
  return useMutation({
    mutationFn: async (query: string) => {
      const response = await googleSDKPlaceSearch.get("", {
        params: {
          query,
        },
      });
      return response.data?.results;
    },
  });
}

export function useFetchGooglePlaceImageByReference() {
  return useMutation({
    mutationFn: async (photo_reference: string) => {
      const response = await googleSDKPhotoSearch.get("", {
        params: {
          maxwidth: 500,
          photo_reference,
        },
      });
      return response.data;
    },
  });
}
