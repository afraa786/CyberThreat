import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import AuthPage from "./components/AuthPage.tsx"; // Our consolidated auth component
import ThreatReport from "./components/ThreatReportApp.tsx";
import Chatbot from "./components/Chatbot";
import Url from "./components/Url.tsx";
import Token from "./components/Tokens.tsx";
import FAQs from "./pages/FAQs.tsx";
import "./index.css";
import ThreatReportApp from "./components/ThreatReportApp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import WiChainDashboard from "./components/scan.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
  path: "/dashboard",
  element: (
   
      <WiChainDashboard />
  
  ),
},

  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/threat",
    element: (
      <ProtectedRoute>
        <ThreatReport />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chatbot",
    element: (
      <ProtectedRoute>
        <Chatbot />
      </ProtectedRoute>
    ),
  },
  {
    path: "/url",
    element: (
      <ProtectedRoute>
        <Url />
      </ProtectedRoute>
    ),
  },
  {
    path: "/token",
    element: (
      <ProtectedRoute>
        <Token />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faqs",
    element: <FAQs />, // FAQs can remain public
  },
  {
    path: "/threatsnitch",
    element: (
      <ProtectedRoute>
        <ThreatReportApp />
      </ProtectedRoute>
    ),
  },
  // No need for separate verify route since it's handled in AuthPage
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);