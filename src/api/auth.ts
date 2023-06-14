import { useAppDatabase } from "@exploriana/hooks/use-database";
import { User } from "@exploriana/interface/core";
import { createFactory } from "@exploriana/lib/core";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";

export function useLogin() {
  const [database] = useAppDatabase();

  return useMutation({
    mutationFn: async ({ password, phoneNumber }: { phoneNumber: string; password: string }) => {
      return await createFactory(Promise<User>, (resolve, reject) => {
        database!.transaction((sql) => {
          sql.executeSql(
            `SELECT * FROM users AS user WHERE user.phoneNumber = ? AND user.password = ?;`,
            [phoneNumber, password],
            (_, { rows }) => {
              const user = rows.item(0);
              if (!user) {
                reject();
              } else {
                resolve(user);
              }
            },
            (error) => {
              reject(error);
              return false;
            }
          );
        });
      });
    },
  });
}

export function useRegister() {
  const [database] = useAppDatabase();

  return useMutation({
    mutationFn: async ({ fullName, password, phoneNumber }: { fullName: string; phoneNumber: string; password: string }) => {
      return await createFactory(Promise<User>, (resolve, reject) => {
        const id = nanoid();

        database!.transaction((sql) => {
          sql.executeSql(
            `CREATE TABLE IF NOT EXISTS users (id TEXT NOT NULL PRIMARY KEY, fullName TEXT, phoneNumber TEXT, password TEXT);`,
            [],
            () => {},
            (_, error) => {
              console.log(error);
              reject(error);
              return false;
            }
          );
        });

        database!.transaction((sql) => {
          sql.executeSql(
            `INSERT INTO users VALUES (?,?,?,?);`,
            [id, fullName, phoneNumber, password],
            () => {
              resolve({ fullName, phoneNumber, id });
            },
            (_, error) => {
              console.log(error);
              reject(error);
              return false;
            }
          );
        });
      });
    },
  });
}
