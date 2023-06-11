import { Nullable } from "@exploriana/interface/helper";
import { useEffect, useRef, useState } from "react";

type Handler = Nullable<NodeJS.Timeout>;

export default function useDebounceState<T>(value: T, delay: number) {
  const [query, setQuery] = useState<T>(value);

  const handle = useRef<Handler>(null);

  useEffect(() => {
    if (handle.current) clearTimeout(handle.current);

    handle.current = setTimeout(() => {
      setQuery(value);
    }, delay);

    return () => {
      if (handle.current) clearTimeout(handle.current);
    };
  }, [value, delay]);

  return query;
}
