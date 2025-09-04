"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { communityService, CommunityData } from "@/api/CommunityService";

export default function Page() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Create community form state
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | undefined>(
    undefined
  );
  const [creating, setCreating] = useState<boolean>(false);

  // 🔑 Token & Auth state
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await communityService.getCommunities(token);
        setCommunities(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load communities");
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      setCreating(true);
      const payload: CommunityData = { name, description } as CommunityData;
      const created = await communityService.createCommunity(
        token,
        payload,
        profilePicture
      );
      setCommunities((prev) => [created, ...prev]);
      setShowCreate(false);
      setName("");
      setDescription("");
      setProfilePicture(undefined);
    } catch (e: any) {
      setError(e?.message || "Failed to create community");
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">🌌 Communities</h1>
        <p className="text-gray-400 mb-4">
          Please login to view and create communities.
        </p>
        <Link
          className="inline-block px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg"
          href="/login"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">🌌 Communities</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all shadow-md"
        >
          {showCreate ? "Close" : "➕ Create Community"}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="px-3 py-2 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Community Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="px-3 py-2 rounded-md bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="sm:col-span-2 px-3 py-2 rounded-md bg-black/40 border border-gray-600 text-white file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files?.[0])}
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all shadow-md disabled:opacity-50 text-white"
            >
              {creating ? "Creating..." : "🚀 Create"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-rose-400 mb-4">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/Community/${c.id}`}
            className="block rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="p-5 flex items-start gap-4">
              {c.profile_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.profile_picture}
                  alt={c.name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/20"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {c.name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
              <div>
                <div className="font-semibold text-lg text-white">
                  {c.name}
                </div>
                {c.description && (
                  <div className="text-sm text-gray-400 line-clamp-2">
                    {c.description}
                  </div>
                )}
                {typeof c.total_members_count !== "undefined" && (
                  <div className="text-xs text-gray-500 mt-2">
                    👥 Members: {c.total_members_count}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
