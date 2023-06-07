import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { State, Station } from "@exploriana/interface/core";
import { createFactory } from "@exploriana/lib/core";
import { useQuery } from "@tanstack/react-query";
import utils from "lodash";

const initial = { name: "", code: "" };

function createStateCode(state: string) {
  const parts = state.split(" ");
  if (parts.length > 1) return utils.toUpper(parts.reduce((result, part) => result + part.charAt(0), ""));
  return utils.toUpper(parts[0].substring(0, 2));
}

function createStationCode(city: string) {
  const mid = Math.floor(city.length / 2);
  return utils.toUpper(city.charAt(0) + city.charAt(mid) + city.charAt(city.length - 1));
}

export function useFetchLocationFromAddressQuery(address: string) {
  const [database] = useSQLiteDatabase();

  const city = address.split(",")[0].trim();
  const name = address.split(",")[1].trim();

  return useQuery(
    ["cities", { address }],
    async () => {
      const state = await createFactory(Promise<State>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT name, code FROM states AS state WHERE state.name = ?;`,
            [name],
            (_, { rows }) => {
              const state: State = rows.length > 0 ? rows.item(0) : { code: createStateCode(name), name };
              resolve(state);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );

      const station = await createFactory(Promise<State>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT name, code FROM stations AS station WHERE station.name LIKE ?;`,
            [`%${city}%`],
            (_, { rows }) => {
              const station: Station = rows.length > 0 ? rows.item(0) : { code: createStationCode(city), name: city };
              resolve(station);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );

      return { city, state, station };
    },
    {
      initialData: { city, state: initial, station: initial },
      enabled: Boolean(database) && Boolean(city) && Boolean(name),
      retry: false,
    }
  );
}
