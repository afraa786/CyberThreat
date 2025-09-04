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

  // Token & Auth state
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-3xl">🌌</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-neutral-100">
                Communities
              </h1>
              
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Please login to view and create communities. Join the conversation and connect with like-minded individuals.
              </p>
              
              <Link
                href="/login"
                className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">Go to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="text-4xl">🌌</span>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-3xl font-bold text-neutral-100">
                Communities
              </h1>
            </div>

            <button
              onClick={() => setShowCreate(!showCreate)}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center space-x-2">
                <span>{showCreate ? "Close" : "➕ Create Community"}</span>
              </span>
            </button>
          </div>

          <p className="text-neutral-400 text-lg max-w-2xl">
            Discover and join communities that match your interests. Connect with people, share ideas, and build meaningful relationships.
          </p>
        </div>

        {/* Create Community Form */}
        {showCreate && (
          <div className="mb-8">
            <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-neutral-100 mb-6">
                  Create New Community
                </h2>

                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Community Name"
                        required
                        className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePicture(e.target.files?.[0])}
                      className="w-full px-4 py-4 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-neutral-900 file:font-medium hover:file:bg-emerald-400 file:transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="group w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative flex items-center justify-center space-x-2">
                      <span>{creating ? "Creating..." : "🚀 Create"}</span>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-neutral-400">
              <div className="rounded-full h-6 w-6 border-2 border-emerald-400 border-t-transparent animate-spin"></div>
              <span className="text-lg">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        {/* Communities Grid */}
        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <Link key={c.id} href={`/Community/${c.id}`}>
                <div className="group relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="flex items-start space-x-4 mb-4">
                      {c.profile_picture ? (
                        <img
                          src={c.profile_picture}
                          alt={c.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-neutral-600 group-hover:border-emerald-500/50 transition-colors"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <span className="text-xl font-bold text-emerald-400">
                            {c.name?.[0]?.toUpperCase() || "C"}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-neutral-100 truncate group-hover:text-emerald-400 transition-colors">
                          {c.name}
                        </h3>
                        {c.description && (
                          <p className="text-sm text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-700/50">
                      <div className="flex items-center space-x-2 text-neutral-400">
                        <span className="text-sm">
                          {typeof c.total_members_count !== "undefined"
                            ? `👥 ${c.total_members_count} members`
                            : "Community"}
                        </span>
                      </div>

                      <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">Join →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && communities.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="relative rounded-2xl bg-neutral-800/50 p-12 backdrop-blur-sm border border-neutral-700/50 shadow-2xl max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-3xl">🌌</span>
                </div>
                
                <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                  No Communities Yet
                </h3>
                <p className="text-neutral-400 mb-6">
                  Be the first to create a community and start building connections!
                </p>
                
                <button
                  onClick={() => setShowCreate(true)}
                  className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Create First Community</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}