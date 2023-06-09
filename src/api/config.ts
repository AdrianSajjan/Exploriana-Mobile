import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { createFactory } from "@exploriana/lib/core";
import { useMutation, useQuery } from "@tanstack/react-query";

type Config = {
  key: string;
  value: string;
};

export function useConfigAsync(key: string) {
  const [database] = useSQLiteDatabase();

  return useQuery(["config", { key }], async () => {
    return createFactory(Promise<string>, (resolve, reject) => {
      database!.transaction((sql) => {
        sql.executeSql(
          `SELECT value FROM config WHERE config.key = ?;`,
          [key],
          (_, { rows }) => {
            if (rows.length > 0) {
              const config: Config = rows.item(0);
              resolve(config.value);
            } else {
              reject("Provided key is invalid or doesn't exist");
            }
          },
          (_, error) => {
            reject(error.message);
            return false;
          }
        );
      });
    });
  });
}

export function useConfig() {
  const [database] = useSQLiteDatabase();
  const mutation = useMutation({
    mutationFn: async (key: string) => {
      return createFactory(Promise<string>, (resolve, reject) => {
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT value FROM config WHERE config.key = ?;`,
            [key],
            (_, { rows }) => {
              if (rows.length > 0) {
                const config: Config = rows.item(0);
                resolve(config.value);
              } else {
                reject(`Provided key is invalid or doesn't exist`);
              }
            },
            (_, error) => {
              reject(error.message);
              return false;
            }
          );
        });
      });
    },
  });
  return { get: mutation.mutate, getAsync: mutation.mutateAsync, ...mutation };
}
