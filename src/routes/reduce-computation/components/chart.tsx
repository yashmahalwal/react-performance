import { memo, useRef } from "react";
import { StockEvent } from "../../../utilities/stocks";
import { Line } from "react-chartjs-2";

export type ChartProps = {
  list: StockEvent[];
};

// Options for the line chart
const options = {
  animation: false,
} as const;

// Number of items to calculate average over
const batchSize = 50;

/**
 * Component representing the chart displaying average prices of stocks over time.
 * @param props - Props containing list of stock events.
 */
export const Chart = memo(({ list }: ChartProps) => {
  // Reference to store average prices and labels
  const averagePrices = useRef<{ value: number; label: number }[]>([]);
  // Reference to store the size of the previous stock event list
  const oldItemsSize = useRef(list.length);

   // Update average prices when the stock event list changes
  if (oldItemsSize.current != list.length) {
    // Input list is changed
    oldItemsSize.current = list.length;
    if (list.length) {
      // Get the new stock event
      const newEntry = list.at(-1)!;
      const averages = averagePrices.current;
      // Calculate the sum of previous 50 prices
      const prevSum = averages.length
        ? averages.at(-1)!.value * averages.length
        : 0;
      if (averages.length < batchSize) {
        // If not enough items for a full batch, add the new event price to sum
        averages.push({
          value: (prevSum + newEntry.price) / (averages.length + 1),
          label: list.length,
        });
      } else {
        // If enough items for a full batch, subtract the first item in the average prices from sum
        // And add the new event price
        const entry =
          prevSum - list.at(-(batchSize + 1))!.price + newEntry.price;
        averages.shift();
        averages.push({ value: entry / batchSize, label: list.length });
      }
    } else {
      // Reset average prices if the list is empty
      averagePrices.current = [];
    }
  }

    // Configuration for the chart
    // Component is memoized and has no state
    // so we don't need to add memoization for this object
  const config = {
    labels: averagePrices.current.map((e) => e.label),
    datasets: [
      {
        id: "1",
        label: "Average Price",
        data: averagePrices.current.map((e) => e.value),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={config} />;
});
