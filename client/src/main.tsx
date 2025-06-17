import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThreatReportApp from "./components/ThreatReportApp.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Signup from "./components/Signup.tsx";
import ThreatReport from "./components/ThreatReport.tsx";
import Chatbot from "./components/Chatbot";   // Import chatbot
import Url from "./components/Url.tsx";
import Chatbox from "./components/Chatbox.tsx";
import Token from "./components/Tokens.tsx";


import "./index.css";

const router = createBrowserRouter([
  {
    path: "/threat",
    element: <ThreatReport />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/chatbot",
    element: <Chatbot />,     // Add chatbot route here
  },
  {
    path: "/url",
    element: <Url />,
  },
  {
    path: "/chatbox",
    element: <Chatbox />,
  },
  {
    path : "/token",
    element: <Token />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
