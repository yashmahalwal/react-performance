import { Actions } from "./actions";
import { StockTable } from "./StockTable";
import { Chart } from "./chart";

export function OptimiseUpdates() {
  return (
    <>
      <h1 className="text-xl text-center">
        Step 2: Isolate updates and UX enhancements
      </h1>
      <article className="flex flex-col align-middle mt-4">
        <Actions />
        <section className="mt-6">
          <Chart />
        </section>
        <section className="mt-6">
          <StockTable />
        </section>
      </article>
    </>
  );
}
