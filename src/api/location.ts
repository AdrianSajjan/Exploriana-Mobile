import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { State, Station } from "@exploriana/interface/core";
import { createFactory } from "@exploriana/lib/core";
import { useQuery } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";

type Result = { city: string; state: State; station: Station };

export function useFetchLocationFromAddressQuery(address: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(
    ["cities", { address }] as const,
    async (context) => {
      const params = context.queryKey[1];

      const city = params.address.split(",")[0].trim();
      const name = params.address.split(",")[1].trim();

      const sql = await createFactory(Promise<SQLite.SQLTransaction>, (resolve) => database.transaction(resolve));

      const state: State = await createFactory(Promise<State>, (resolve, reject) =>
        sql.executeSql(
          `SELECT name, code FROM states AS state WHERE state.name = ?;`,
          [name],
          (_, result) => {
            const state = result.rows._array[0];
            resolve(state);
          },
          (_, error) => {
            reject(error.message);
            return false;
          }
        )
      );

      const station: Station = await createFactory(Promise<Station>, (resolve, reject) =>
        sql.executeSql(
          `SELECT name, code FROM stations AS station WHERE station.name LIKE ?;`,
          [`%${city}%`],
          (_, result) => {
            const station = result.rows._array[0];
            resolve(station);
          },
          (_, error) => {
            reject(error.message);
            return false;
          }
        )
      );

      const result: Result = { city, state, station };
      return result;
    },
    {
      initialData: { city: "", state: { name: "", code: "" }, station: { name: "", code: "" } },
      enabled: Boolean(database) && Boolean(address),
      retry: false,
    }
  );
}
