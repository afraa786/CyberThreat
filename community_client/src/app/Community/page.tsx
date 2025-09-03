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
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Communities</h1>
        <p className="text-gray-400">Please login to view and create communities.</p>
        <Link className="text-blue-400 underline" href="/login">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Communities</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          {showCreate ? "Close" : "Create Community"}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-8 p-4 border border-gray-700 rounded-lg"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="px-3 py-2 rounded bg-black/30 border border-gray-700"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="px-3 py-2 rounded bg-black/30 border border-gray-700"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="sm:col-span-2 px-3 py-2 rounded bg-black/30 border border-gray-700"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files?.[0])}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-rose-400 mb-4">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/Community/${c.id}`}
            className="block border border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
          >
            <div className="p-4 flex items-start gap-3">
              {c.profile_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.profile_picture}
                  alt={c.name}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center">
                  {c.name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
              <div>
                <div className="font-semibold">{c.name}</div>
                {c.description && (
                  <div className="text-sm text-gray-400 line-clamp-2">
                    {c.description}
                  </div>
                )}
                {typeof c.total_members_count !== "undefined" && (
                  <div className="text-xs text-gray-500 mt-1">
                    Members: {c.total_members_count}
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
