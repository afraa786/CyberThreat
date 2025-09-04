import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import AuthPage from "./components/AuthPage.tsx"; 
import ThreatReport from "./components/ThreatReportApp.tsx";
import Chatbot from "./components/Chatbot";
import Url from "./components/Url.tsx";
import Token from "./components/Tokens.tsx";
import Docs from "./components/Docs.tsx"; 
import FAQs from "./pages/FAQs.tsx";
import "./index.css";
import ThreatReportApp from "./components/ThreatReportApp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import WiChainDashboard from "./components/scan.tsx";
import Profile from "./pages/Profile.tsx";
import Community from "./components/community.tsx";
import Email from "./components/email.tsx";
//import Check from "./components/check.tsx";
import CyberThreatDashboard from "./components/map.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  // {
  //   path: "/check",
  //   element: (
  //     <ProtectedRoute>
  //       <Check />
  //     </ProtectedRoute>
  //   ),
  // },
  {
  path: "/wifi",
  element: (
      <ProtectedRoute>
      <WiChainDashboard />
     </ProtectedRoute>
  ),
},
{
  path: "/map",
  element: (
      <ProtectedRoute>
      <CyberThreatDashboard />
      </ProtectedRoute>
  ),
},
  {
    path: "/email",
    element: (
      <ProtectedRoute>
        <Email />
      </ProtectedRoute>
    ),
  },
 {
   path: "/community",
    element: (
      <ProtectedRoute>
        <Community />
      </ProtectedRoute>
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
    path: "/docs",
    element: (
      <ProtectedRoute>
        <Docs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/faqs",
    element: <FAQs />, 
  },

  {
    path: "/threatsnitch",
    element: (
      <ProtectedRoute>
        <ThreatReportApp />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile", 
    element: (
      <ProtectedRoute>
        <Profile />
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