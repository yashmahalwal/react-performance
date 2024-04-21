import { useMemo, useSyncExternalStore } from "react";
import { StockStoreType, useStockStore } from "../store/stock-store";
import throttle from "lodash.throttle";
import { useStableCallback } from "../../../hooks/use-stable-callback";

/**
 * Custom hook to use a throttled version of the stock store.
 * @param selector - Function to select data from the stock store.
 * @param throttleInterval - Throttle interval for updates.
 * @returns {T} - Selected data from the stock store.
 */
export function useThrottledStore<T>(
  selector: (store: StockStoreType) => T,
  throttleInterval = 600
) {
  // stable selector function
  const stableSelector = useStableCallback(selector);
  const getValue = useStableCallback(() => {
    return stableSelector(useStockStore.getState());
  });
  // Throttled update function
  const getThrottledSnapshot = useMemo(
    () =>
      throttle(() => {
        return getValue();
      }, throttleInterval),
    [getValue, throttleInterval]
  );

  const getSnapshot = useStableCallback(() => {
    return getThrottledSnapshot() ?? getValue();
  });

  // Subscribe to store updates
  return useSyncExternalStore<T>(useStockStore.subscribe, getSnapshot);
}
