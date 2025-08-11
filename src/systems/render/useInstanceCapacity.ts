import { useState, useEffect, useCallback } from "react";

export function useInstanceCapacity(length: number) {
  const [capacity, setCapacity] = useState(() => Math.max(length, 1));

  useEffect(() => {
    if (length > capacity) {
      setCapacity(Math.max(length, capacity * 2));
    }
  }, [length, capacity]);

  const updateCapacity = useCallback(
    (min = 0) => {
      const target = Math.max(length, min);
      if (target > capacity) {
        setCapacity(Math.max(target, capacity * 2));
      }
    },
    [length, capacity],
  );

  return [capacity, updateCapacity] as const;
}
