import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { Transport } from "@exploriana/interface/core";
import { createFactory, initializeDate } from "@exploriana/lib/core";
import { useQuery } from "@tanstack/react-query";
import { addMinutes, differenceInMinutes, endOfToday } from "date-fns";
import utils from "lodash";

export function useFetchTrainsByRouteQuery(placeOfDeparture: string, placeOfArrival: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(
    ["cities", { placeOfArrival, placeOfDeparture }] as const,
    async () => {
      return createFactory(Promise<Transport[]>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM trains WHERE trains.placeOfDeparture LIKE ? AND trains.placeOfArrival LIKE ?;`,
            [`%${placeOfDeparture}%`, `%${placeOfArrival}%`],
            (_, result) => {
              const trains = result.rows._array;
              const averageTimeTaken = 60 * utils.random(3, 18); // Random
              const data: Transport[] = trains.map((train) => {
                const price = utils.random(1000, 5000); // Random
                const currentDate = initializeDate(); // Random
                const minutesLeftTillMidnight = differenceInMinutes(endOfToday(), currentDate); // Random
                const timeOfDeparture = addMinutes(currentDate, utils.random(minutesLeftTillMidnight)).toISOString(); // Random
                const timeOfArrival = addMinutes(initializeDate(timeOfDeparture), averageTimeTaken + utils.random(60)).toISOString(); // Random
                return { ...train, price, timeOfDeparture, timeOfArrival, type: "train" };
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
