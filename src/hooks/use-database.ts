import { databaseKey } from "@exploriana/config/app";
import { connectToSQLiteDatabase } from "@exploriana/lib/sql";
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
