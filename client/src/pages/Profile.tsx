import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  RefreshCw,
  AlertCircle,
  Key
} from "lucide-react";

// Define user type for TypeScript
interface UserType {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  enabled: boolean;
}

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [tempData, setTempData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Helper function to extract error message
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'An unknown error occurred';
    }
  };

  // API service functions
  const apiService = {
    // Fetch current user
    fetchCurrentUser: async (): Promise<UserType> => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8080/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("API Error:", message);
        throw new Error(`Failed to fetch user: ${message}`);
      }
    },

    // Fetch all users
    fetchAllUsers: async (): Promise<UserType[]> => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8080/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("API Error:", message);
        throw new Error(`Failed to fetch users: ${message}`);
      }
    },

    // Update user
    updateUser: async (userData: UserType): Promise<UserType> => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8080/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("API Error:", message);
        throw new Error(`Failed to update user: ${message}`);
      }
    },
  };

  // Fetch data with retry logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [userData, usersData] = await Promise.all([
          apiService.fetchCurrentUser(),
          apiService.fetchAllUsers(),
        ]);
        
        setCurrentUser(userData);
        setTempData(userData);
        setAllUsers(usersData);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(currentUser ? {...currentUser} : null);
  };

  const handleSave = async () => {
    if (!tempData) return;
    
    try {
      setLoading(true);
      const updatedUser = await apiService.updateUser(tempData);
      setCurrentUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(currentUser ? {...currentUser} : null);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field: keyof UserType, value: string) => {
    if (tempData) {
      setTempData({ ...tempData, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
        <RefreshCw className="w-12 h-12 animate-spin mb-4 text-emerald-400" />
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 p-6">
        <div className="max-w-md w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-2">We couldn't fetch your profile data.</p>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry Connection
          </button>
        </div>
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

  // Profile Section using current user data
  const ProfileSection = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
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
              {currentUser.username || "No username"}
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              {currentUser.email || "No email"}
            </p>
            <p className="text-gray-400 text-sm mb-3">
              User ID: {currentUser.id || "N/A"}
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
                value={tempData?.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">{currentUser.username || "No username"}</span>
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
                value={tempData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-white">{currentUser.email || "No email"}</span>
              </div>
            )}
          </div>

          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User ID
            </label>
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <Key className="w-5 h-5 text-gray-400" />
              <span className="text-white">{currentUser.id || "N/A"}</span>
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

      {/* All Users List */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            All Users in System ({allUsers.length})
          </h3>
          <button 
            onClick={handleRetry}
            className="flex items-center text-sm text-emerald-400 hover:text-emerald-300"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
        {allUsers.length === 0 ? (
          <p className="text-gray-400">No users found</p>
        ) : (
          <div className="space-y-2">
            {allUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <span className="text-white font-medium">{user.username || "No username"}</span>
                  <span className="text-gray-400 text-sm ml-3">({user.email || "No email"})</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.enabled ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}>
                  {user.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
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