import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./routes/root/root";
import { Unoptimised } from "./routes/unoptimised/unoptimised";
import { OptimiseCalculations } from "./routes/optimise-calculations/optimise-calculations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Unoptimised /> },
      { path: "/optimise-calculations", element: <OptimiseCalculations /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>
);
