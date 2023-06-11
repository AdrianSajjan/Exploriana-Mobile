import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { Airport, Location, State, Station } from "@exploriana/interface/core";
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

export function useSearchCitiesQuery(query: string) {
  const [database] = useSQLiteDatabase();
  return useQuery(
    ["cities", { query }],
    async () => {
      return await createFactory(Promise<Location[]>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM cities WHERE cities.city LIKE ?;`,
            ["%" + query + "%"],
            (_, result) => {
              resolve(result.rows._array);
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
      enabled: Boolean(database),
      retry: false,
    }
  );
}

export function useFetchStationFromNameQuery(name: string) {
  const [database] = useSQLiteDatabase();
  return useQuery(
    ["station", { name }],
    async () => {
      const station = await createFactory(Promise<Station>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM stations AS station WHERE station.name LIKE ?;`,
            [`%${name}%`],
            (_, { rows }) => {
              const station: Station = rows.length > 0 ? rows.item(0) : { code: createStationCode(name), name, city: "" };
              resolve(station);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );
      return station;
    },
    {
      enabled: Boolean(name),
    }
  );
}

export function useFetchAirportsByCityQuery(city: string) {
  const [database] = useSQLiteDatabase();
  return useQuery(
    ["airports", { city }],
    async () => {
      const airport = await createFactory(Promise<Airport>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM airports AS airport WHERE airport.city LIKE ?;`,
            [`%${city}%`],
            (_, { rows }) => {
              const airport: Airport = rows.item(0);
              resolve(airport);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );
      return airport;
    },
    {
      enabled: Boolean(city),
    }
  );
}

export function useFetchStateFromCity(city: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(
    ["state", { city }],
    async () => {
      const state = await createFactory(Promise<State>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT name, code FROM states INNER JOIN cities ON states.name = cities.state WHERE cities.city LIKE ?;`,
            [`%${city}%`],
            (_, { rows }) => {
              const state: State = rows.length > 0 ? rows.item(0) : { code: "", name: "" };
              resolve(state);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );
      return state;
    },
    {
      enabled: Boolean(city),
    }
  );
}

export function useFetchLocationFromAddressQuery(address: string) {
  const [database] = useSQLiteDatabase();

  const city = address.split(",")[0].trim();
  const name = address.split(",")[1].trim();

  return useQuery(
    ["location", { address }],
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

      const station = await createFactory(Promise<Omit<Station, "city">>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT name, code FROM stations AS station WHERE station.name LIKE ?;`,
            [`%${city}%`],
            (_, { rows }) => {
              const station: Omit<Station, "city"> = rows.length > 0 ? rows.item(0) : { code: createStationCode(city), name: city };
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

export function useFetchAirportLocationFromAddressQuery(address: string) {
  const [database] = useSQLiteDatabase();

  const city = address.split(",")[0].trim();
  const name = address.split(",")[1].trim();

  return useQuery(
    ["location", { address }],
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

      const airport = await createFactory(Promise<Airport>, (resolve, reject) =>
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM airports AS airport WHERE airport.city LIKE ?;`,
            [`%${city}%`],
            (_, { rows }) => {
              const airport: Airport = rows.length > 0 ? rows.item(0) : { city: "", iata: "", icao: "", name: "", state: "" };
              resolve(airport);
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        })
      );

      return { city, state, airport };
    },
    {
      initialData: { city, state: initial, airport: { city: "", iata: "", icao: "", name: "", state: "" } },
      enabled: Boolean(database) && Boolean(city) && Boolean(name),
      retry: false,
    }
  );
}
