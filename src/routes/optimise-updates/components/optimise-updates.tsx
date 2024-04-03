import { Actions } from "./actions";
import { StockTable } from "./stock-table";
import { Chart } from "./chart";

export function OptimiseUpdates() {
  return (
    <>
      <h1 className="text-xl text-center">Reduce Update Rate</h1>
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
