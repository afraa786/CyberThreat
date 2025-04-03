
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Signup from "./components/Signup.tsx";
import "./index.css";
import ThreatReport from "./components/ThreatReport.tsx";

const router = createBrowserRouter([
  {

    path: "/threat",
    element: <ThreatReport />, // Load only this component
  },
  {
    path: "/home",
    element: <App/>, // Load only this component
  },
  {
    path:"/",
    element:<Signup/>
  },

]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
