import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { Transport } from "@exploriana/interface/core";
import { createFactory, initializeDate } from "@exploriana/lib/core";
import { createAirplaneID } from "@exploriana/lib/uuid";
import { useQuery } from "@tanstack/react-query";
import { addMinutes, differenceInMinutes, endOfToday } from "date-fns";
import utils from "lodash";

export function useFetchFlightsByRouteQuery(placeOfDeparture: string, placeOfArrival: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(
    ["flights", { placeOfArrival, placeOfDeparture }] as const,
    async () => {
      return createFactory(Promise<Transport[]>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM flights`,
            [],
            (_, result) => {
              const flights = result.rows._array;
              const averageTimeTaken = 60 * utils.random(1, 6); // Random
              const data: Transport[] = flights.map((flight) => {
                const price = utils.random(6000, 18000); // Random
                const currentDate = initializeDate(); // Random
                const minutesLeftTillMidnight = differenceInMinutes(endOfToday(), currentDate); // Random
                const timeOfDeparture = addMinutes(currentDate, utils.random(minutesLeftTillMidnight)).toISOString(); // Random
                const timeOfArrival = addMinutes(initializeDate(timeOfDeparture), averageTimeTaken + utils.random(60)).toISOString(); // Random
                const id = createAirplaneID(flight.icao); // Random
                return { ...flight, id, price, timeOfDeparture, placeOfDeparture, placeOfArrival, timeOfArrival, type: "flight" };
              });
              resolve(data);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );
    },
    {
      initialData: [],
      enabled: Boolean(database) && Boolean(placeOfDeparture) && Boolean(placeOfArrival),
      retry: false,
    }
  );
}
