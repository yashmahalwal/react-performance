import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./routes/root/root";
import { Unoptimised } from "./routes/unoptimised/unoptimised";
import { ReduceComputations } from "./routes/reduce-computation/components/reduce-computation";
import { OptimiseUpdates } from "./routes/optimise-updates/components/optimise-updates";
import { ReduceRenders } from "./routes/reduce-renders/reduce-renders";
import { AddMemo } from "./routes/add-memo/add-memo";
import { OptimiseMemory } from "./routes/optimise-memory/components/optimise-memory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Unoptimised /> },
      { path: "/add-memo", element: <AddMemo /> },
      { path: "/reduce-renders", element: <ReduceRenders /> },
      { path: "/reduce-computation", element: <ReduceComputations /> },
      { path: "/optimise-updates", element: <OptimiseUpdates /> },
      { path: "/optimise-memory", element: <OptimiseMemory /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <RouterProvider router={router} />
  </NextUIProvider>
);
