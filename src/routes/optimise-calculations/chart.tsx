import { useRef } from "react";
import { StockEvent } from "../../utilities/stocks";
import { Line } from "react-chartjs-2";

export type ChartProps = {
  list: StockEvent[];
};

const options = {
  animation: false,
} as const;

const batchSize = 50;

export function Chart({ list }: ChartProps) {
  const averagePrices = useRef<{ value: number; label: number }[]>([]);
  const oldItemsSize = useRef(list.length);

  if (oldItemsSize.current != list.length) {
    // Input list is changed
    oldItemsSize.current = list.length;
    if (list.length) {
      const newEntry = list.at(-1)!;
      const averages = averagePrices.current;
      const prevSum = averages.length
        ? averages.at(-1)!.value * averages.length
        : 0;
      if (averages.length < batchSize) {
        averages.push({
          value: (prevSum + newEntry.price) / (averages.length + 1),
          label: list.length,
        });
      } else {
        const entry =
          prevSum - list.at(-(batchSize + 1))!.price + newEntry.price;
        averages.shift();
        averages.push({ value: entry / batchSize, label: list.length });
      }
    } else {
      averagePrices.current = [];
    }
  }

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
}
