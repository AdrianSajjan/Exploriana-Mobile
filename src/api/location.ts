import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { State } from "@exploriana/interface/core";
import { createFactory } from "@exploriana/lib/core";
import { useQuery } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";

export function useFetchLocationFromAddressQuery(address: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(
    ["cities", { address }] as const,
    async (context) => {
      const params = context.queryKey[1];
      const name = params.address.split(",")[1].trim();
      const sql = await createFactory(Promise<SQLite.SQLTransaction>, (resolve) => database.transaction(resolve));
      const results = await createFactory(Promise<{ city: string; state: State }>, (resolve, reject) =>
        sql.executeSql(
          `SELECT * FROM states WHERE states.name = ?;`,
          [name],
          (_, result) => {
            const city = params.address.split(",")[0].trim();
            const state = result.rows._array[0];
            resolve({ city, state });
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
      initialData: { city: "", state: { name: "", code: "" } },
      enabled: Boolean(database) && Boolean(address),
      retry: false,
    }
  );
}
