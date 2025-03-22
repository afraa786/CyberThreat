import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThreatReportApp from "./components/ThreatReportApp.tsx"; // Import your desired component
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThreatReportApp />, // Load only this component
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
