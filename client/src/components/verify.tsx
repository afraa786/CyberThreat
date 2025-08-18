"use client";
import { useState } from "react";
import axios from "axios";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/verify", {
        email,
        code,
      });
      setMessage("✅ Verification successful. You can now log in!");
    } catch (error: any) {
      setMessage("❌ Invalid code or email. Please try again.");
      console.error("Verification failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl font-bold mb-4 text-neonBlue">Email Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 w-80 bg-gray-800 text-white border border-neonBlue rounded"
      />
      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mb-4 p-2 w-80 bg-gray-800 text-white border border-neonBlue rounded"
      />
      <button
        onClick={handleVerify}
        className="px-6 py-2 bg-neonBlue rounded hover:scale-105 transition"
      >
        Verify
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
