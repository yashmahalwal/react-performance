import { useCallback, useRef, useState } from "react";
import { StockEvent, generateRandomStockEvent } from "../utilities/stocks";

export function useMonitorStocks(observer: (event: StockEvent) => void) {
  const [isWatching, setIsWatching] = useState(false);

  const callback = useRef(observer);
  callback.current = observer;

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
      callback.current(generateRandomStockEvent());
    }, 50);
  }, [unobserve]);

  return { observe, unobserve, isWatching };
}
