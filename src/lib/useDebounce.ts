import { useState, useEffect } from "react";

/**
 * useDebounce
 * Retourne la valeur "value" après un délai d'inactivité (debounce)
 * @param value La valeur à "debouncer"
 * @param delay Le délai en ms
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 