import React, { useState } from 'react';
import { Navibar } from '../components/navbar';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Shield,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Camera,
  ChevronRight
} from 'lucide-react';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Cybersecurity enthusiast with 5+ years of experience in threat analysis and digital forensics.',
    joinDate: '2022-03-15',
    avatar: null
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
              {profileData.avatar ? (
                <img 
                  src={profileData.avatar} 
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
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-400 text-sm mb-3">Member since {new Date(profileData.joinDate).toLocaleDateString()}</p>
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

      {/* Personal Information */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">{profileData.firstName}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">{profileData.lastName}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-white">{profileData.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={tempData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-white">{profileData.phone}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={tempData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-white">{profileData.location}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={tempData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            ) : (
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <span className="text-white">{profileData.bio}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Password & Security</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value="••••••••••"
                readOnly
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400 text-sm">Disabled</span>
            <div className="w-12 h-6 bg-gray-600 rounded-lg relative cursor-pointer">
              <div className="w-5 h-5 bg-gray-400 rounded-lg absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
        
        <button className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
          Enable Two-Factor Authentication
        </button>
      </div>

      {/* Login Sessions */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div>
              <div className="text-white text-sm font-medium">Current Session</div>
              <div className="text-gray-400 text-xs">Chrome on MacOS • San Francisco, CA</div>
            </div>
            <span className="text-emerald-400 text-xs">Active now</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div>
              <div className="text-white text-sm font-medium">Mobile App</div>
              <div className="text-gray-400 text-xs">iPhone • San Francisco, CA</div>
            </div>
            <span className="text-gray-400 text-xs">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {[
            { title: 'Email Notifications', description: 'Receive updates via email', enabled: true },
            { title: 'Push Notifications', description: 'Get notified on your device', enabled: false },
            { title: 'Security Alerts', description: 'Important security notifications', enabled: true },
            { title: 'Weekly Reports', description: 'Weekly summary of activities', enabled: true }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <div className="text-white text-sm font-medium">{item.title}</div>
                <div className="text-gray-400 text-xs">{item.description}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${item.enabled ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {item.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <div className={`w-12 h-6 rounded-lg relative cursor-pointer transition-colors ${
                  item.enabled ? 'bg-emerald-600' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-lg absolute top-0.5 transition-transform ${
                    item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
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
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </motion.div>

          {/* Tabs */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 mb-8">
            <div className="flex space-x-1">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'security' && <SecuritySection />}
            {activeTab === 'notifications' && <NotificationsSection />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;