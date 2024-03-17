import { Button } from "@nextui-org/react";
import { useMonitorStocks } from "../../../hooks/use-monitor-stocks";
import { StockEvent } from "../../../utilities/stocks";
import { useStableCallback } from "../../../hooks/use-stable-callback";

export type ActionsProps = {
  onReset(): void;
  onStockEvent(event: StockEvent): void;
};

export function Actions({ onStockEvent, onReset }: ActionsProps) {
  const { observe, unobserve, isWatching } = useMonitorStocks(onStockEvent);

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
      <Button color="primary" variant="bordered" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
