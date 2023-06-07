import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { Transport } from "@exploriana/interface/core";
import { createFactory, initializeDate } from "@exploriana/lib/core";
import { useQuery } from "@tanstack/react-query";
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
            const date = initializeDate().toISOString();
            const data: Transport[] = trains.map((train) => ({ ...train, price: 4500, timeOfDeparture: date, timeOfArrival: date }));
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
