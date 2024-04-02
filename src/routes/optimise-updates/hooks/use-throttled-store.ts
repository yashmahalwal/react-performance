import { useEffect, useMemo, useState } from "react";
import { StockStoreType, useStockStore } from "../store/stock-store";
import throttle from "lodash.throttle";
import { useStableCallback } from "../../../hooks/use-stable-callback";

export function useThrottledStore<T>(selector: (store: StockStoreType) => T) {
  const [state, setState] = useState(() => {
    return selector(useStockStore.getState());
  });
  const stableSelector = useStableCallback(selector);
  const update = useMemo(
    () =>
      throttle((store: StockStoreType) => {
        setState(stableSelector(store));
      }, 500),
    [stableSelector]
  );
  useEffect(() => {
    return useStockStore.subscribe(update);
  }, [update]);

  return state;
}
