import { Line } from "react-chartjs-2";
import { useStockStore } from "../store/stock-store";
import { selectAveragePrices } from "../store/stock-store-selectors";

const options = {
  animation: false,
} as const;

export function Chart() {
  const averagePrices = useStockStore(selectAveragePrices);

  const config = {
    labels: averagePrices.map((e) => e.label),
    datasets: [
      {
        id: "1",
        label: "Average Price",
        data: averagePrices.map((e) => e.value),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={config} />;
}
