import { weatherSDK } from "@exploriana/config/api";
import { useQuery } from "@tanstack/react-query";

export function useFetchWeatherForecast(q: string) {
  return useQuery(
    ["weather"],
    async () => {
      const response = await weatherSDK.get("", {
        params: {
          q,
          days: 7,
          aqi: "no",
          alerts: "no",
        },
      });
      return response.data;
    },
    {
      enabled: q.length > 2,
    }
  );
}
