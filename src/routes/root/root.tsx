import { Outlet } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);


export function Root() {
  return (
    <section className="m-auto max-w-screen-lg h-full py-4 px-4">
      <Outlet />
    </section>
  );
}
