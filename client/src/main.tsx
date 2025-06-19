import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import ThreatReportApp from "./components/ThreatReportApp.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Signup from "./components/Signup.tsx";
import ThreatReport from "./components/ThreatReportApp.tsx";
import Chatbot from "./components/Chatbot";   // Import chatbot
import Url from "./components/Url.tsx";
import Token from "./components/Tokens.tsx";
import Loginform from "./components/loginform.tsx";

import "./index.css";
import { LoginRequest } from "./types/index.ts";
import ThreatReportApp from "./components/ThreatReportApp.tsx";

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
    path : "/token",
    element: <Token />,
  },
  
  {
    path: "/community",
    element: <Loginform onLogin={function (loginData: LoginRequest): Promise<void> {
      throw new Error("Function not implemented.");
    } } isLoading={false} error={null} />,
  },
  
  {
    path : "/threatsnitch",
    element: <ThreatReportApp />, 
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
