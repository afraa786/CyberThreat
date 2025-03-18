import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Signup from './components/Signup.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css';

const router=createBrowserRouter([
  {
    path:'/',
    element:<Signup/>
  },
  {
    path:'/home',
    element:<App/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
