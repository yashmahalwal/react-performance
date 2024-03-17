import { Button } from "@nextui-org/react";
import { useMonitorStocks } from "../../../hooks/use-monitor-stocks";
import { useStableCallback } from "../../../hooks/use-stable-callback";
import { useStockStore } from "../store/stock-store";
import { selectAdd, selectReset } from "../store/stock-store-selectors";

export function Actions() {
  const add = useStockStore(selectAdd);
  const reset = useStockStore(selectReset);
  const { observe, unobserve, isWatching } = useMonitorStocks(add);

  const handleWatchToggle = useStableCallback(() => {
    if (!isWatching) {
      observe();
    } else {
      unobserve();
    }
  });

  return (
    <div className="flex gap-2 justify-center">
      <Button color="primary" variant="solid" onClick={handleWatchToggle}>
        {isWatching ? "Unobserve" : "Observe"}
      </Button>
      <Button color="primary" variant="bordered" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}
