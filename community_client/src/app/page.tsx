"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/Login"); // token nahi mila to login pe bhej
          return;
        }

        // verify token with backend
        const res = await fetch("http://localhost:8000/api/authentication/user", {
          headers: {
            "Authorization": `${token}`,
          },
        });

        if (res.ok) {
          // token valid hai
          router.replace("/Community");
        } else {
          // token galat hai
          localStorage.removeItem("token");
          router.replace("/Login");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("token");
        router.replace("/Login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  return null; // kuch render nahi karna, bas redirect handle hoga
}
