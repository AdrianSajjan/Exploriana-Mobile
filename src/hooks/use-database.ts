import { appDatabaseKey, databaseKey } from "@exploriana/config/app";
import { connectToAppDatabase, connectToSQLiteDatabase } from "@exploriana/lib/sql";
import { useQuery } from "@tanstack/react-query";

export function useSQLiteDatabase() {
  const query = useQuery(
    [databaseKey],
    async () => {
      const database = await connectToSQLiteDatabase();
      return database;
    },
    {
      staleTime: Infinity,
      retry: false,
    }
  );

  return [query.data, query] as const;
}

export function useAppDatabase() {
  const query = useQuery(
    [appDatabaseKey],
    async () => {
      const database = connectToAppDatabase();
      return database;
    },
    {
      staleTime: Infinity,
      retry: false,
    }
  );

  return [query.data, query] as const;
}
