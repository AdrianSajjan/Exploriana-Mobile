import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllToursQuery() {
  const [database] = useSQLiteDatabase();
  return useQuery(["tours"], async () => {});
}

export function useFetchPopularToursQuery() {
  const [database] = useSQLiteDatabase();
  return useQuery(["tours"], async () => {});
}
