import { useEffect } from "react";
import { eventBus } from "./bus";
import type { AppEvents } from "./types";

export function useEventBus<K extends keyof AppEvents>(
  event: K,
  handler: (payload: AppEvents[K]) => void,
) {
  useEffect(() => {
    const off = eventBus.on(event, handler);
    return () => off();
  }, [event, handler]);
}

export default useEventBus;
