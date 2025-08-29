import React, { useState, useEffect } from "react";
import { Navibar } from "../components/navbar";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [allUsers, setAllUsers] = useState<any[]>([]); // Store all users
  const [currentUser, setCurrentUser] = useState<any>(null); // Current logged-in user
  const [tempData, setTempData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ fetch all users and find current user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const usersData = await res.json();
        setAllUsers(usersData);
        
        // Get current user's email from token or localStorage
        const userEmail = localStorage.getItem("userEmail") || "shaikhafraabi@gmail.com"; // Fallback for demo
        
        // Find current user in the list
        const foundUser = usersData.find((user: any) => user.email === userEmail);
        
        if (foundUser) {
          setCurrentUser(foundUser);
          setTempData(foundUser);
        } else {
          // Fallback: use first user if current not found
          setCurrentUser(usersData[0]);
          setTempData(usersData[0]);
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...currentUser });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      const res = await fetch("http://localhost:8080/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tempData),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const updatedUsers = await res.json();
      setAllUsers(updatedUsers);
      
      // Update current user from the updated list
      const updatedCurrentUser = updatedUsers.find((user: any) => user.email === currentUser.email);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleCancel = () => {
    setTempData({ ...currentUser });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData({ ...tempData, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Loading profile...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-red-500">
        Failed to load profile
      </div>
    );
  }

  // ✅ Profile Section using current user data
  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {currentUser.username}
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              {currentUser.email}
            </p>
            <p className="text-gray-400 text-sm mb-3">
              User ID: {currentUser.id}
            </p>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">{currentUser.username}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={tempData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-white">{currentUser.email}</span>
              </div>
            )}
          </div>

          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User ID
            </label>
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <span className="text-white">{currentUser.id}</span>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Account Status
            </label>
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <span className="text-white">
                {currentUser.enabled ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* All Users List (for debugging) */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          All Users in System ({allUsers.length})
        </h3>
        <div className="space-y-2">
          {allUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div>
                <span className="text-white font-medium">{user.username}</span>
                <span className="text-gray-400 text-sm ml-3">({user.email})</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                user.enabled ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}>
                {user.enabled ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Change Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email Notifications</h4>
              <p className="text-gray-400 text-sm">Receive email updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Push Notifications</h4>
              <p className="text-gray-400 text-sm">Receive browser notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navibar />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 mb-8">
            <div className="flex space-x-1">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "security", label: "Security", icon: Shield },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "notifications" && <NotificationsSection />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;