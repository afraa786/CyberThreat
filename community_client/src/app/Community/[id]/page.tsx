"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { communityService } from "@/api/CommunityService";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [community, setCommunity] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Update form state
  const [editing, setEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | undefined>(
    undefined
  );
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const canEdit =
    community?.user_role === "super_admin" || community?.user_role === "admin";

  // Role management state
  const [roleUserId, setRoleUserId] = useState<string>("");
  const [roleValue, setRoleValue] = useState<
    "member" | "admin" | "super_admin"
  >("member");
  const [roleSaving, setRoleSaving] = useState<boolean>(false);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await communityService.getCommunity(token, params.id);
        setCommunity(data);
        setName(data?.name || "");
        setDescription(data?.description || "");
      } catch (e: any) {
        setError(e?.message || "Failed to load community");
      } finally {
        setLoading(false);
      }
    };
    fetchCommunity();
  }, [token, params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !community?.id) return;
    try {
      setSaving(true);
      const updated = await communityService.updateCommunity(
        token,
        community.id,
        { name, description },
        profilePicture
      );
      setCommunity(updated);
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || "Failed to update community");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !community?.id || !roleUserId) return;
    try {
      setRoleSaving(true);
      setRoleMessage(null);
      await communityService.assignRole(token, Number(community.id), {
        user_id: Number(roleUserId),
        role: roleValue,
      });
      setRoleMessage("✅ Role updated successfully");
      setRoleUserId("");
      setRoleValue("member");
    } catch (e: any) {
      setRoleMessage(e?.message || "Failed to assign role");
    } finally {
      setRoleSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !community?.id) return;
    if (!confirm("Are you sure you want to delete this community?")) return;
    try {
      setDeleting(true);
      await communityService.deleteCommunity(token, community.id);
      window.location.href = "/Community";
    } catch (e: any) {
      setError(e?.message || "Failed to delete community");
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-semibold mb-2">Community</h1>
        <p className="text-gray-400 mb-4">
          Please login to view community details.
        </p>
        <Link
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow"
          href="/Login"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/Community"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Communities
        </Link>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-rose-400 mb-4">{error}</p>}

      {community && (
        <div className="bg-gradient-to-b from-gray-900/60 to-gray-800/40 border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 flex items-start gap-5 border-b border-gray-700">
            {community.profile_picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={community.profile_picture}
                alt={community.name}
                className="w-20 h-20 rounded-xl object-cover border border-gray-600"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold">
                {community.name?.[0]?.toUpperCase() || "C"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{community.name}</h1>
              {community.description && (
                <p className="text-gray-400 mt-2">{community.description}</p>
              )}
              <div className="text-xs text-gray-500 mt-3">
                Role:{" "}
                <span className="px-2 py-1 rounded bg-white/5 border border-gray-600">
                  {community.user_role || "member"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="p-4 flex items-center gap-3 border-b border-gray-700">
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                {editing ? "Cancel" : "✏️ Edit Community"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition"
              >
                {deleting ? "Deleting..." : "🗑️ Delete"}
              </button>
            </div>
          )}

          {/* Edit form */}
          {canEdit && editing && (
            <form
              onSubmit={handleSave}
              className="p-6 border-b border-gray-700 grid gap-4"
            >
              <input
                className="px-3 py-2 rounded-lg bg-black/30 border border-gray-700"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                className="px-3 py-2 rounded-lg bg-black/30 border border-gray-700"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-black/30 border border-gray-700"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files?.[0])}
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </form>
          )}

          {/* Role management */}
          {canEdit && (
            <div className="p-6">
              <h3 className="font-semibold mb-4 text-lg">
                👥 Role Management
              </h3>
              <form
                onSubmit={handleAssignRole}
                className="grid gap-4 sm:grid-cols-3 items-end"
              >
                <input
                  className="px-3 py-2 rounded-lg bg-black/30 border border-gray-700"
                  placeholder="User ID"
                  value={roleUserId}
                  onChange={(e) => setRoleUserId(e.target.value)}
                  required
                />
                <select
                  className="px-3 py-2 rounded-lg bg-black/30 border border-gray-700"
                  value={roleValue}
                  onChange={(e) => setRoleValue(e.target.value as any)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <button
                  type="submit"
                  disabled={roleSaving}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 transition"
                >
                  {roleSaving ? "Saving..." : "Assign/Update"}
                </button>
              </form>
              {roleMessage && (
                <div className="text-sm mt-3 text-green-400">{roleMessage}</div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Only admins/super_admins can assign roles. Admins cannot
                modify super_admins.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
