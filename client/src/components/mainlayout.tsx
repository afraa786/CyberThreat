import { Outlet } from "react-router-dom";
import { Navibar } from "./navbar.tsx"; 

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white">
      <Navibar />

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}