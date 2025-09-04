"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // Token remove from localStorage
    localStorage.removeItem("token");

    // Optional: clear other user-related data
    // localStorage.removeItem("user");

    // Redirect to login (or home)
    router.push("/Login"); // Change to "/" if you want home instead
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <h1 className="text-lg font-bold text-white">Securo</h1>

        {/* Links */}
        <div className="flex gap-6 text-white font-medium">
          <Link
            href="http://localhost:3000"
            className="hover:text-blue-300 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/Community"
            className="hover:text-blue-300 transition-colors"
          >
            Community
          </Link>
          <Link
            href="/Feed"
            className="hover:text-blue-300 transition-colors"
          >
            Feed
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
