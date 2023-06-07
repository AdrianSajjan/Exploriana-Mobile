import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { Transport } from "@exploriana/interface/core";
import { createFactory, initializeDate } from "@exploriana/lib/core";
import { useQuery } from "@tanstack/react-query";
import { addHours, addMinutes, differenceInHours, differenceInMinutes, endOfToday } from "date-fns";
import utils from "lodash";
import * as SQLite from "expo-sqlite";

export function useFetchTrainsByRouteQuery(placeOfDeparture: string, placeOfArrival: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(
    ["cities", { placeOfArrival, placeOfDeparture }] as const,
    async (context) => {
      const params = context.queryKey[1];
      const sql = await createFactory(Promise<SQLite.SQLTransaction>, (resolve) => database.transaction(resolve));
      const results = await createFactory(Promise<Transport[]>, (resolve, reject) =>
        sql.executeSql(
          `SELECT * FROM trains WHERE trains.placeOfDeparture LIKE ? AND trains.placeOfArrival LIKE ?;`,
          [`%${params.placeOfDeparture}%`, `%${params.placeOfArrival}%`],
          (_, result) => {
            const trains = result.rows._array;
            const averageTimeTaken = 60 * utils.random(3, 18); // Random
            const data: Transport[] = trains.map((train) => {
              const price = utils.random(1000, 5000); // Random
              const currentDate = initializeDate(); // Random
              const minutesLeftTillMidnight = differenceInMinutes(endOfToday(), currentDate); // Random
              const timeOfDeparture = addMinutes(currentDate, utils.random(minutesLeftTillMidnight)).toISOString(); // Random
              const timeOfArrival = addMinutes(initializeDate(timeOfDeparture), averageTimeTaken + utils.random(60)).toISOString(); // Random
              return { ...train, price, timeOfDeparture, timeOfArrival };
            });
            resolve(data);
          },
          (_, error) => {
            reject(error.message);
            return false;
          }
        )
      );
      return results;
    },
    {
      initialData: [],
      enabled: Boolean(database) && Boolean(placeOfDeparture) && Boolean(placeOfArrival),
      retry: false,
    }
  );
}
