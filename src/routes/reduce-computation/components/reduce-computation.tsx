import { useState } from "react";
import { StockEvent } from "../../../utilities/stocks";
import { Actions, ActionsProps } from "./actions";
import { useStableCallback } from "../../../hooks/use-stable-callback";
import { StockTable } from "./stock-table";
import { Chart } from "./chart";

/**
* Component with reduced computations.
 */
export function ReduceComputations() {
  const [stockEventList, setStockEventList] = useState<StockEvent[]>([]);


  /**
   * Callback function to handle new stock events.
   * @param event New stock event
   */
  const onStockEvent: ActionsProps["onStockEvent"] = useStableCallback(
    (event) => {
      setStockEventList((old) => [...old, event]);
    }
  );

  /**
   * Callback function to reset stock event list.
   */
  const onReset = useStableCallback(() => {
    setStockEventList([]);
  });

  return (
    <>
      <h1 className="text-xl text-center">Reduce Computation Effort</h1>
      <article className="flex flex-col align-middle mt-4">
        <Actions onReset={onReset} onStockEvent={onStockEvent} />
        <section className="mt-6">
          <Chart list={stockEventList} />
        </section>
        <section className="mt-6">
          <StockTable list={stockEventList} />
        </section>
      </article>
    </>
  );
}
