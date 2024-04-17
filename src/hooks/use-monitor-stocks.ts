import { useCallback, useRef, useState } from "react";
import { StockEvent, generateRandomStockEvent } from "../utilities/stocks";
import { useStableCallback } from "./use-stable-callback";

const eventIntervalMs = 200;

export function useMonitorStocks(observer: (event: StockEvent) => void) {
  const [isWatching, setIsWatching] = useState(false);

  const callback = useStableCallback(observer);

  const timer = useRef<null | number>(null);

  const unobserve = useCallback(() => {
    if (timer.current) {
      setIsWatching(false);
      clearInterval(timer.current);
    }
  }, []);

  const observe = useCallback(() => {
    unobserve();

    timer.current = setInterval(() => {
      setIsWatching(true);
      callback(generateRandomStockEvent());
    }, eventIntervalMs);
  }, [callback, unobserve]);

  return { observe, unobserve, isWatching };
}
