import { useEffect, useRef, useState } from "react";
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

/**
 * Component for displaying unoptimized stock monitoring.
 * @returns JSX element
 */
export function Unoptimised() {
  // State to store list of stock events
  const [stockEventList, setStockEventList] = useState<StockEvent[]>([]);
  // State to store list of running average of prices
  const [averagePrices, setAveragePrices] = useState<number[]>([]);
  // Ref for the table element
  const tableRef = useRef<HTMLDivElement>(null);

  // Custom hook to monitor stocks
  const { observe, unobserve, isWatching } = useMonitorStocks((event) => {
    // Add new stock event to the listlo
    setStockEventList((old) => [...old, event]);
  });

  // Side effect of adding a stock event
  useEffect(() => {
    if (stockEventList.length) {
      // Calculate average prices
      const event = stockEventList.at(-1)!;
      const newTotal =
        stockEventList.reduce((old, current) => old + current.price, 0) +
        event.price;
      const newAverage = newTotal / (stockEventList.length + 1);
      setAveragePrices((old) => [...old, newAverage]);
      // Scroll to bottom of table
      const scrollContainer = tableRef.current?.parentElement;
      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [stockEventList]);

  // Handler to reset stock event list and average prices
  const handleReset = () => {
    setStockEventList([]);
    setAveragePrices([]);
  };

  // Handler to toggle stock monitoring
  const handleWatchToggle = () => {
    isWatching ? unobserve() : observe();
  };

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

  // Last 50 average prices
  const last50Prices = averagePrices.slice(-50);
  // Labels for the chart
  const labels = last50Prices.map(
    (_, i) => i + Math.max(averagePrices.length - 50, 0)
  );

  // Data for the chart
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

  return (
    <>
      <h1 className="text-xl text-center">Unoptimised Stock Monitoring</h1>
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
        {/* Line chart to display average prices */}
        <section className="mt-6">
          <Line
            options={{
              animation: false,
            }}
            data={chartData}
          />
        </section>
        {/* Table to display stock events */}
        <section className="mt-6">
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
        </section>
      </article>
    </>
  );
}
