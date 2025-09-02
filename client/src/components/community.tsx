import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Search, TrendingUp, Clock, Award, MessageCircle,
  ArrowUp, ArrowDown, Share2, Bookmark, ExternalLink, Eye,
  Filter, Settings, Bell, Globe, Shield, Star, Hash,
  ChevronRight, Calendar, UserPlus, AlertTriangle
} from 'lucide-react';
import { Navibar } from './navbar';

interface User {
  id: string;
  username: string;
  avatar: string;
  karma: number;
  cakeDay: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'link' | 'image';
  url?: string;
  author: User;
  community: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  commentCount: number;
  createdAt: Date;
  awards: number;
  saved?: boolean;
}

interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  icon: string;
  banner: string;
  members: number;
  onlineMembers: number;
  createdAt: Date;
  moderators: User[];
  rules: string[];
  isJoined: boolean;
  category: string;
  tags: string[];
}

const CommunityPage: React.FC = () => {
  // Sample data
  const sampleUsers: User[] = [
    { id: '1', username: 'tech_guru', avatar: '🧑‍💻', karma: 1250, cakeDay: '2023-01-15' },
    { id: '2', username: 'coding_ninja', avatar: '🥷', karma: 890, cakeDay: '2023-03-22' },
    { id: '3', username: 'dev_enthusiast', avatar: '👩‍💻', karma: 2100, cakeDay: '2022-11-08' },
    { id: '4', username: 'security_expert', avatar: '🔐', karma: 3450, cakeDay: '2022-08-14' },
    { id: '5', username: 'cyber_analyst', avatar: '🛡️', karma: 2890, cakeDay: '2023-02-03' },
  ];

  const sampleCommunities: Community[] = [
    {
      id: '1',
      name: 'cybersecurity',
      displayName: 'Cybersecurity Hub',
      description: 'Advanced cybersecurity discussions, threat intelligence, and protection strategies',
      longDescription: 'A community dedicated to cybersecurity professionals, researchers, and enthusiasts. Share threat intelligence, discuss security tools, analyze vulnerabilities, and stay updated on the latest cyber threats and defense mechanisms.',
      icon: '🛡️',
      banner: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      members: 125000,
      onlineMembers: 2341,
      createdAt: new Date('2022-01-15'),
      moderators: [sampleUsers[3], sampleUsers[4]],
      rules: [
        'Keep discussions professional and constructive',
        'No sharing of malicious code or exploits',
        'Verify information before posting threat intelligence',
        'Respect privacy and confidentiality',
        'Follow responsible disclosure practices'
      ],
      isJoined: false,
      category: 'Technology',
      tags: ['security', 'threats', 'malware', 'pentesting', 'compliance']
    },
    {
      id: '2',
      name: 'phishing_awareness',
      displayName: 'Phishing Awareness Network',
      description: 'Share phishing examples, educate users, and discuss prevention techniques',
      longDescription: 'Community focused on phishing awareness and education. Share suspicious emails, discuss social engineering tactics, and help others learn to identify and avoid phishing attempts.',
      icon: '🎣',
      banner: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      members: 78500,
      onlineMembers: 1456,
      createdAt: new Date('2022-06-20'),
      moderators: [sampleUsers[0], sampleUsers[2]],
      rules: [
        'Anonymize all shared phishing examples',
        'No live malicious links',
        'Educational content only',
        'Help newcomers learn to identify threats'
      ],
      isJoined: true,
      category: 'Education',
      tags: ['phishing', 'education', 'social-engineering', 'awareness']
    },
    {
      id: '3',
      name: 'threat_intel',
      displayName: 'Threat Intelligence Collective',
      description: 'Real-time threat intelligence sharing and analysis',
      longDescription: 'Professional community for sharing and analyzing threat intelligence. Discuss IOCs, TTPs, threat actor activities, and coordinate defensive measures across organizations.',
      icon: '🎯',
      banner: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      members: 56780,
      onlineMembers: 891,
      createdAt: new Date('2022-03-10'),
      moderators: [sampleUsers[1], sampleUsers[4]],
      rules: [
        'Verified threat intelligence only',
        'Proper attribution and sourcing',
        'No speculation without evidence',
        'Follow TLP protocols for sensitive information'
      ],
      isJoined: false,
      category: 'Intelligence',
      tags: ['intel', 'iocs', 'attribution', 'analysis']
    },
    {
      id: '4',
      name: 'incident_response',
      displayName: 'Incident Response Team',
      description: 'Digital forensics, incident handling, and emergency response protocols',
      longDescription: 'Professional community for incident response specialists and digital forensics experts. Share case studies, discuss investigation techniques, and coordinate response strategies for security incidents.',
      icon: '🚨',
      banner: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      members: 89200,
      onlineMembers: 1234,
      createdAt: new Date('2022-02-28'),
      moderators: [sampleUsers[1], sampleUsers[3]],
      rules: [
        'No disclosure of ongoing investigations',
        'Sanitize all case study data',
        'Professional discussion only',
        'Follow legal and ethical guidelines'
      ],
      isJoined: true,
      category: 'Response',
      tags: ['forensics', 'incident', 'investigation', 'response', 'analysis']
    },
    {
      id: '5',
      name: 'red_team',
      displayName: 'Red Team Operations',
      description: 'Offensive security testing, penetration testing methodologies and tactics',
      longDescription: 'Community for ethical hackers and penetration testers to discuss offensive security techniques, share testing methodologies, and improve red team operations while maintaining ethical standards.',
      icon: '⚔️',
      banner: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)',
      members: 67340,
      onlineMembers: 987,
      createdAt: new Date('2022-04-12'),
      moderators: [sampleUsers[0], sampleUsers[4]],
      rules: [
        'Ethical hacking discussion only',
        'No unauthorized testing examples',
        'Educational and defensive focus',
        'Respect scope and authorization'
      ],
      isJoined: false,
      category: 'Testing',
      tags: ['redteam', 'pentesting', 'ethical-hacking', 'testing', 'offensive']
    },
    {
      id: '6',
      name: 'blue_team',
      displayName: 'Blue Team Defense',
      description: 'Defensive security strategies, monitoring, and threat hunting techniques',
      longDescription: 'Defensive security community focused on threat hunting, security monitoring, SOC operations, and building robust defense systems against cyber attacks.',
      icon: '🔵',
      banner: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      members: 94650,
      onlineMembers: 1678,
      createdAt: new Date('2022-05-08'),
      moderators: [sampleUsers[2], sampleUsers[3]],
      rules: [
        'Focus on defensive strategies',
        'Share detection techniques',
        'Collaborate on threat hunting',
        'Discuss SOC best practices'
      ],
      isJoined: true,
      category: 'Defense',
      tags: ['blueteam', 'defense', 'monitoring', 'soc', 'hunting']
    },
    {
      id: '7',
      name: 'crypto_security',
      displayName: 'Cryptography & Security',
      description: 'Cryptographic protocols, blockchain security, and encryption technologies',
      longDescription: 'Community dedicated to cryptography, blockchain security, and encryption technologies. Discuss crypto implementations, security protocols, and emerging cryptographic methods.',
      icon: '🔐',
      banner: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
      members: 43210,
      onlineMembers: 654,
      createdAt: new Date('2022-07-15'),
      moderators: [sampleUsers[0], sampleUsers[1]],
      rules: [
        'Mathematical accuracy required',
        'No broken crypto implementations',
        'Academic and practical focus',
        'Peer review encouraged'
      ],
      isJoined: false,
      category: 'Cryptography',
      tags: ['crypto', 'encryption', 'blockchain', 'protocols', 'algorithms']
    },
    {
      id: '8',
      name: 'security_news',
      displayName: 'Security News & Updates',
      description: 'Latest cybersecurity news, vulnerability disclosures, and industry updates',
      longDescription: 'Stay informed with the latest cybersecurity news, vulnerability announcements, industry trends, and security updates from around the world.',
      icon: '📰',
      banner: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      members: 156780,
      onlineMembers: 3421,
      createdAt: new Date('2021-11-03'),
      moderators: [sampleUsers[1], sampleUsers[2]],
      rules: [
        'Credible sources only',
        'No sensationalized headlines',
        'Fact-check before posting',
        'Provide proper context'
      ],
      isJoined: true,
      category: 'News',
      tags: ['news', 'vulnerabilities', 'updates', 'industry', 'trends']
    },
    {
      id: '9',
      name: 'privacy_tech',
      displayName: 'Privacy & Technology',
      description: 'Digital privacy tools, anonymity techniques, and privacy-preserving technologies',
      longDescription: 'Community focused on digital privacy, anonymity tools, privacy-preserving technologies, and techniques to protect personal data in the digital age.',
      icon: '🕵️',
      banner: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
      members: 71890,
      onlineMembers: 1123,
      createdAt: new Date('2022-08-01'),
      moderators: [sampleUsers[2], sampleUsers[4]],
      rules: [
        'Respect legal boundaries',
        'Educational privacy content',
        'No illegal activities',
        'Promote digital rights'
      ],
      isJoined: false,
      category: 'Privacy',
      tags: ['privacy', 'anonymity', 'vpn', 'tor', 'encryption']
    }
  ];
  
  const samplePosts: Post[] = [
    {
      id: '1',
      title: 'New Phishing Campaign Targeting Financial Institutions',
      content: 'Discovered a sophisticated phishing campaign using legitimate-looking banking domains. The attackers are using advanced social engineering techniques...',
      type: 'text',
      author: sampleUsers[3],
      community: 'cybersecurity',
      upvotes: 347,
      downvotes: 8,
      commentCount: 89,
      createdAt: new Date(Date.now() - 3600000),
      awards: 3
    },
    {
      id: '2',
      title: 'URL Analysis Tool Demo - Detecting Malicious Links',
      content: 'Built a machine learning tool that analyzes URLs for phishing attempts. Check it out and let me know what you think!',
      type: 'link',
      url: 'https://github.com/example/url-analyzer',
      author: sampleUsers[0],
      community: 'cybersecurity',
      upvotes: 892,
      downvotes: 12,
      commentCount: 156,
      createdAt: new Date(Date.now() - 7200000),
      awards: 5
    }
  ];

  // State
  const [communities] = useState<Community[]>(sampleCommunities);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts] = useState<Post[]>(samplePosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'rules'>('posts');

  const filteredCommunities = communities.filter(community =>
    community.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    
    if (years > 0) return `${years}y ago`;
    if (months > 0) return `${months}mo ago`;
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'just now';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const joinCommunity = (communityId: string) => {
    setSelectedCommunity(prev => 
      prev && prev.id === communityId 
        ? { ...prev, isJoined: !prev.isJoined, members: prev.isJoined ? prev.members - 1 : prev.members + 1 }
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <Navibar />
      
      <div className="container mx-auto mt-1 p-4 md:p-8">
        {!selectedCommunity ? (
          // Communities List View
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Users className="h-8 w-8 text-emerald-400" />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full"
                  />
                </div>
                <h1 className="text-3xl font-bold text-neutral-100">
                  Communities
                </h1>
              </div>
              <p className="text-neutral-400 text-lg">
                Discover and join cybersecurity communities to share knowledge, discuss threats, and stay protected.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative rounded-2xl bg-neutral-800/50 p-6 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-neutral-500" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search communities, topics, or tags..."
                        className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      {['Technology', 'Education', 'Intelligence'].map(category => (
                        <button
                          key={category}
                          className="px-4 py-2 bg-neutral-700/50 text-neutral-300 rounded-xl hover:bg-emerald-400/20 hover:text-emerald-400 transition-all duration-300 border border-neutral-600"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Communities Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl overflow-hidden cursor-pointer group hover:border-emerald-400/50 transition-all duration-300"
                  onClick={() => setSelectedCommunity(community)}
                >
                  {/* Banner */}
                  <div 
                    className="h-24 relative"
                    style={{ background: community.banner }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-2xl border-2 border-neutral-700 group-hover:border-emerald-400 transition-all duration-300">
                        {community.icon}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-8">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors">
                          {community.displayName}
                        </h3>
                        <p className="text-sm text-emerald-400 font-mono">
                          c/{community.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <p className="text-neutral-300 text-sm mb-4 line-clamp-2">
                      {community.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-emerald-400" />
                          <span className="text-neutral-300">{formatNumber(community.members)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-neutral-400">{formatNumber(community.onlineMembers)} online</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 text-xs rounded-full">
                        {community.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {community.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-neutral-700/50 text-neutral-400 text-xs rounded-md">
                          #{tag}
                        </span>
                      ))}
                      {community.tags.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-700/50 text-neutral-400 text-xs rounded-md">
                          +{community.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        joinCommunity(community.id);
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        community.isJoined 
                          ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 hover:from-emerald-400 hover:to-emerald-500'
                      }`}
                    >
                      {community.isJoined ? 'Joined' : 'Join Community'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-neutral-100 mb-6 flex items-center gap-3">
                  <Hash className="h-6 w-6 text-emerald-400" />
                  Popular Tags
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['security', 'malware', 'phishing', 'pentesting', 'compliance', 'forensics', 'incident-response', 'threat-hunting'].map(tag => (
                    <button
                      key={tag}
                      className="p-3 bg-neutral-700/30 rounded-xl text-neutral-300 hover:bg-emerald-400/20 hover:text-emerald-400 transition-all duration-300 text-left"
                    >
                      <div className="font-medium">#{tag}</div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {Math.floor(Math.random() * 500) + 100} posts
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          // Individual Community View
          <div>
            {/* Community Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => setSelectedCommunity(null)}
                className="group flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
              >
                <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-x-1 rotate-[-90deg]" />
                <span>Back to Communities</span>
              </button>

              <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl overflow-hidden">
                {/* Banner */}
                <div 
                  className="h-32 relative"
                  style={{ background: selectedCommunity.banner }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
                </div>

                <div className="p-8 relative">
                  <div className="absolute -top-8 left-8">
                    <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center text-3xl border-4 border-neutral-700">
                      {selectedCommunity.icon}
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-neutral-100 mb-2">
                        {selectedCommunity.displayName}
                      </h1>
                      <p className="text-emerald-400 font-mono mb-4">
                        c/{selectedCommunity.name}
                      </p>
                      <p className="text-neutral-300 text-lg max-w-2xl">
                        {selectedCommunity.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => joinCommunity(selectedCommunity.id)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          selectedCommunity.isJoined 
                            ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 hover:from-emerald-400 hover:to-emerald-500'
                        }`}
                      >
                        {selectedCommunity.isJoined ? 'Joined' : 'Join Community'}
                      </motion.button>
                      <button className="px-6 py-3 bg-neutral-700/50 text-neutral-300 rounded-xl hover:bg-neutral-700 transition-all duration-300">
                        <Plus className="h-4 w-4 inline mr-2" />
                        Create Post
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-700/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{formatNumber(selectedCommunity.members)}</div>
                      <div className="text-neutral-400 text-sm">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{formatNumber(selectedCommunity.onlineMembers)}</div>
                      <div className="text-neutral-400 text-sm">Online</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{selectedCommunity.moderators.length}</div>
                      <div className="text-neutral-400 text-sm">Moderators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{formatTimeAgo(selectedCommunity.createdAt)}</div>
                      <div className="text-neutral-400 text-sm">Created</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
                <div className="relative z-10 p-2">
                  <div className="flex gap-2">
                    {[
                      { id: 'posts', label: 'Posts', icon: MessageCircle },
                      { id: 'about', label: 'About', icon: Globe },
                      { id: 'rules', label: 'Rules', icon: Shield }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          activeTab === tab.id 
                            ? 'bg-emerald-400/20 text-emerald-400' 
                            : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700/30'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* Sort Options */}
                  <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
                    <div className="relative z-10 p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-neutral-400 font-medium">Sort by:</span>
                        <div className="flex gap-2">
                          {[
                            { id: 'hot', label: 'Hot', icon: TrendingUp },
                            { id: 'new', label: 'New', icon: Clock },
                            { id: 'top', label: 'Top', icon: Award }
                          ].map(sort => (
                            <button
                              key={sort.id}
                              onClick={() => setSortBy(sort.id as any)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                sortBy === sort.id 
                                  ? 'bg-emerald-400/20 text-emerald-400' 
                                  : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700/30'
                              }`}
                            >
                              <sort.icon className="h-4 w-4" />
                              {sort.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Posts */}
                  {posts.filter(post => post.community === selectedCommunity.name).map(post => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl overflow-hidden hover:border-emerald-400/30 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
                      <div className="relative z-10 p-6">
                        <div className="flex gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => {/* handleVote logic */}}
                              className={`p-2 rounded-lg hover:bg-neutral-700/50 transition-colors ${
                                post.userVote === 'up' ? 'text-emerald-400' : 'text-neutral-400'
                              }`}
                            >
                              <ArrowUp className="h-5 w-5" />
                            </button>
                            <span className={`font-bold text-sm ${
                              post.userVote === 'up' ? 'text-emerald-400' : 
                              post.userVote === 'down' ? 'text-red-400' : 'text-neutral-300'
                            }`}>
                              {formatNumber(post.upvotes - post.downvotes)}
                            </span>
                            <button
                              onClick={() => {/* handleVote logic */}}
                              className={`p-2 rounded-lg hover:bg-neutral-700/50 transition-colors ${
                                post.userVote === 'down' ? 'text-red-400' : 'text-neutral-400'
                              }`}
                            >
                              <ArrowDown className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Post Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 text-sm">
                              <span className="text-lg">{post.author.avatar}</span>
                              <span className="font-medium text-neutral-300">u/{post.author.username}</span>
                              <span className="text-neutral-500">•</span>
                              <span className="text-neutral-500">{formatTimeAgo(post.createdAt)}</span>
                              {post.awards > 0 && (
                                <>
                                  <span className="text-neutral-500">•</span>
                                  <div className="flex items-center gap-1">
                                    <Award className="h-4 w-4 text-yellow-500" />
                                    <span className="text-neutral-400">{post.awards}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-neutral-100 mb-3 hover:text-emerald-400 cursor-pointer transition-colors">
                              {post.title}
                            </h3>
                            {post.type === 'text' && (
                              <p className="text-neutral-300 line-clamp-3 mb-4">{post.content}</p>
                            )}
                            {post.type === 'link' && (
                              <div className="mb-4">
                                <p className="text-neutral-300 mb-2">{post.content}</p>
                                <a
                                  href={post.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  {post.url}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-6 text-sm text-neutral-400">
                              <button className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                {post.commentCount} comments
                              </button>
                              <button className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                <Share2 className="h-4 w-4" />
                                Share
                              </button>
                              <button className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                <Bookmark className="h-4 w-4" />
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
                  <div className="relative z-10 p-8">
                    <h2 className="text-2xl font-bold text-neutral-100 mb-6 flex items-center gap-3">
                      <Globe className="h-6 w-6 text-emerald-400" />
                      About c/{selectedCommunity.name}
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-100 mb-3">Description</h3>
                        <p className="text-neutral-300 leading-relaxed">
                          {selectedCommunity.longDescription}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-100 mb-3 flex items-center gap-2">
                            <Users className="h-5 w-5 text-emerald-400" />
                            Moderators
                          </h3>
                          <div className="space-y-3">
                            {selectedCommunity.moderators.map(mod => (
                              <div key={mod.id} className="flex items-center gap-3 p-3 bg-neutral-900/30 rounded-xl">
                                <span className="text-2xl">{mod.avatar}</span>
                                <div>
                                  <div className="font-medium text-neutral-100">u/{mod.username}</div>
                                  <div className="text-sm text-neutral-400">{formatNumber(mod.karma)} karma</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-neutral-100 mb-3 flex items-center gap-2">
                            <Hash className="h-5 w-5 text-emerald-400" />
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCommunity.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 bg-emerald-400/20 text-emerald-400 text-sm rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-neutral-900/30 rounded-xl border border-neutral-600">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-emerald-400">{formatNumber(selectedCommunity.members)}</div>
                            <div className="text-neutral-400 text-sm">Total Members</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-emerald-400">{formatNumber(selectedCommunity.onlineMembers)}</div>
                            <div className="text-neutral-400 text-sm">Online Now</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-emerald-400">{Math.floor(Math.random() * 50) + 10}</div>
                            <div className="text-neutral-400 text-sm">Posts Today</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-emerald-400">{selectedCommunity.category}</div>
                            <div className="text-neutral-400 text-sm">Category</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>
                  <div className="relative z-10 p-8">
                    <h2 className="text-2xl font-bold text-neutral-100 mb-6 flex items-center gap-3">
                      <Shield className="h-6 w-6 text-emerald-400" />
                      Community Rules
                    </h2>
                    
                    <div className="space-y-4">
                      {selectedCommunity.rules.map((rule, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-neutral-900/30 rounded-xl border border-neutral-600"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-400/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-neutral-300 leading-relaxed">{rule}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-neutral-900/50 rounded-xl border border-neutral-600">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-neutral-100 mb-2">Important Notice</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">
                            Violation of community rules may result in post removal, temporary suspension, or permanent ban. 
                            Please read and follow all guidelines to maintain a safe and productive environment for all members.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 rounded-full shadow-lg shadow-emerald-500/25 flex items-center justify-center hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300"
          onClick={() => setShowCreatePost(true)}
        >
          <Plus className="h-6 w-6" />
        </motion.button>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-neutral-700"
            >
              <div className="p-6 border-b border-neutral-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-100">Create a post</h2>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="p-2 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-neutral-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Community</label>
                  <div className="p-3 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100">
                    c/{selectedCommunity?.name || 'cybersecurity'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                  <input
                    placeholder="What's your post about?"
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
                    maxLength={300}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Content</label>
                  <textarea
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-xl text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300 resize-none"
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="px-6 py-3 text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700/50 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300"
                  >
                    Post
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;