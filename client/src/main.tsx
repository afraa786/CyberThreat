
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThreatReportApp from "./components/ThreatReportApp.tsx"; // Import your desired component
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Signup from "./components/Signup.tsx";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Signup from './components/Signup.tsx';
import CyberBackground from './components/CyberBackground.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import "./index.css";

const router = createBrowserRouter([
  {

    path: "/threat",
    element: <ThreatReportApp />, // Load only this component
  },
  {
    path: "/home",
    element: <App/>, // Load only this component
  },
  {
    path: "/",
    element: <Signup/>, // Load only this component
  },
]);
    path:'/',
    element:<Signup/>
  },
  {
    path:'/home',
    element:<App/>
  },
  {
    path:'/cyber',
    element:<CyberBackground/>
  }
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
