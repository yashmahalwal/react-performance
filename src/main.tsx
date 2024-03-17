import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./routes/root/root";
import { Unoptimised } from "./routes/unoptimised/unoptimised";
import { OptimiseCalculations } from "./routes/optimise-calculations/components/optimise-calculations";
import { OptimiseUpdates } from "./routes/optimise-updates/components/optimise-updates";
import { ReduceRenders } from "./routes/reduce-renders/reduce-renders";
import { AddMemo } from "./routes/add-memo/add-memo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Unoptimised /> },
      { path: "/add-memo", element: <AddMemo /> },
      { path: "/reduce-renders", element: <ReduceRenders /> },
      { path: "/optimise-calculations", element: <OptimiseCalculations /> },
      { path: "/optimise-updates", element: <OptimiseUpdates /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <RouterProvider router={router} />
  </NextUIProvider>,
);
