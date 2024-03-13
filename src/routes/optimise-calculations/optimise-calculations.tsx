import { useRef, useState } from "react";
import { StockEvent } from "../../utilities/stocks";
import { Actions, ActionsProps } from "./actions";
import { useStableCallback } from "../../hooks/use-stable-callback";
import { StockTable } from "./StockTable";
import { Chart } from "./chart";

export function OptimiseCalculations() {
  const [stockEventList, setStockEventList] = useState<StockEvent[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  const onStockEvent: ActionsProps["onStockEvent"] = useStableCallback(
    (event) => {
      setStockEventList((old) => [...old, event]);
      const scrollContainer = tableRef.current?.parentElement;
      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  );

  const onReset = useStableCallback(() => {
    setStockEventList([]);
  });

  return (
    <>
      <h1 className="text-xl text-center">
        Step 1: Refactor components and calculations
      </h1>
      <article className="flex flex-col align-middle mt-4">
        <Actions onReset={onReset} onStockEvent={onStockEvent} />
        <section className="mt-6">
          <Chart list={stockEventList} />
        </section>
        <section className="mt-6">
          <StockTable ref={tableRef} list={stockEventList} />
        </section>
      </article>
    </>
  );
}
