import { useMemo, useRef, useState } from "react";
import { StockEvent } from "../../utilities/stocks";
import { useMonitorStocks } from "../../hooks/use-monitor-stocks";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { Line } from "react-chartjs-2";
import { useStableCallback } from "../../hooks/use-stable-callback";

// Columns for the table
const tableColumns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "price",
    label: "PRICE",
  },
];

// Options for the line chart
const options = {
  animation: false,
} as const;

/**
 * Component for reducing renders from side effects.
 * @returns JSX element
 */
export function ReduceRenders() {
  // State to store list of stock events
  const [stockEventList, setStockEventList] = useState<StockEvent[]>([]);
  // State to store list of average prices
  const [averagePrices, setAveragePrices] = useState<number[]>([]);
  // Reference for the table element
  const tableRef = useRef<HTMLDivElement>(null);

  // Custom hook to monitor stocks
  const { observe, unobserve, isWatching } = useMonitorStocks((event) => {
    // Add new stock event to the list
    setStockEventList((old) => [...old, event]);
    const newTotal =
      stockEventList.reduce((old, current) => old + current.price, 0) +
      event.price;
    // Calculate the running average
    const newAverage = newTotal / (stockEventList.length + 1);
    setAveragePrices((old) => [...old, newAverage]);
    // Scroll table to the end
    const scrollContainer = tableRef.current?.parentElement;
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  });

  // Memoized callback for resetting stock event list and average prices
  const handleReset = useStableCallback(() => {
    setStockEventList([]);
    setAveragePrices([]);
  });

  // Memoized callback for toggling stock monitoring
  const handleWatchToggle = useStableCallback(() => {
    isWatching ? unobserve() : observe();
  });

  // Memoized chart component
  const chart = useMemo(() => {
    const last50Prices = averagePrices.slice(-50);
    const labels = last50Prices.map(
      (_, i) => i + Math.max(averagePrices.length - 50, 0)
    );

    const chartData = {
      labels,
      datasets: [
        {
          id: "1",
          label: "Average Price",
          data: labels.map((i) => averagePrices[i]),
          fill: false,
          borderColor: "rgba(75,192,192,1)", // Customize the line color
          tension: 0.4, // Adjust the line tension for smoother curves
        },
      ],
    };

    return <Line options={options} data={chartData} />;
  }, [averagePrices]);

  // Memoized table component
  const table = useMemo(() => {
    return (
      <Table
        ref={tableRef}
        aria-label="Example table with dynamic content"
        className="w-screen-sm h-96 [&>div]:flex-1"
        isHeaderSticky
      >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No stocks to display."}
          items={stockEventList}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }, [stockEventList]);

  return (
    <>
      <h1 className="text-xl text-center">
        Reducing Renders due to Side Effects
      </h1>
      <article className="flex flex-col align-middle mt-4">
        <div className="flex gap-2 justify-center">
          {/* Button to toggle stock monitoring */}
          <Button color="primary" variant="solid" onClick={handleWatchToggle}>
            {isWatching ? "Unobserve" : "Observe"}
          </Button>
          {/* Button to reset stock event list */}
          <Button color="primary" variant="bordered" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <section className="mt-6">{chart}</section>
        <section className="mt-6">{table}</section>
      </article>
    </>
  );
}
