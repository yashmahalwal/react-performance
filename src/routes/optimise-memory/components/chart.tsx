import { Line } from "react-chartjs-2";
import { selectAveragePrices } from "../store/stock-store-selectors";
import { useThrottledStore } from "../hooks/use-throttled-store";

const options = {
  animation: false,
} as const;

export function Chart() {
  const averagePrices = useThrottledStore(selectAveragePrices);

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
