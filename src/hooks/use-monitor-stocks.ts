import { useCallback, useRef, useState } from "react";
import { StockEvent, generateRandomStockEvent } from "../utilities/stocks";
import { useStableCallback } from "./use-stable-callback";

/** Interval in milliseconds between generating random stock events */
const eventIntervalMs = 200;

/** Hook to monitor stock events */
export function useMonitorStocks(observer: (event: StockEvent) => void) {
  /** State to indicate whether monitoring is active */
  const [isWatching, setIsWatching] = useState(false);

  /** Memoized stable callback for the observer */
  const callback = useStableCallback(observer);

  /** Reference to the timer */
  const timer = useRef<null | number>(null);

  /** Function to stop monitoring */
  const unobserve = useCallback(() => {
    if (timer.current) {
      setIsWatching(false);
      clearInterval(timer.current);
    }
  }, []);

  /** Function to start monitoring */
  const observe = useCallback(() => {
    unobserve();

    timer.current = setInterval(() => {
      setIsWatching(true);
      callback(generateRandomStockEvent());
    }, eventIntervalMs);
  }, [callback, unobserve]);

  return { observe, unobserve, isWatching };
}
