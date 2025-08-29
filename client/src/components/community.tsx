import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, 
  Search, Plus, User, Home, TrendingUp, Clock, Award,
  ChevronDown, ChevronUp, Send, Edit, Trash2, Flag,
  Eye, MoreHorizontal, Filter, Users
} from 'lucide-react';

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

interface Comment {
  id: string;
  content: string;
  author: User;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  createdAt: Date;
  replies: Comment[];
  level: number;
  parentId?: string;
}

interface Community {
  name: string;
  members: number;
  description: string;
  icon: string;
}

const RedditClone: React.FC = () => {
  // Sample data
  const sampleUsers: User[] = [
    { id: '1', username: 'tech_guru', avatar: '🧑‍💻', karma: 1250, cakeDay: '2023-01-15' },
    { id: '2', username: 'coding_ninja', avatar: '🥷', karma: 890, cakeDay: '2023-03-22' },
    { id: '3', username: 'dev_enthusiast', avatar: '👩‍💻', karma: 2100, cakeDay: '2022-11-08' },
    { id: '4', username: 'pixel_artist', avatar: '🎨', karma: 567, cakeDay: '2023-06-12' },
  ];

  const sampleCommunities: Community[] = [
    { name: 'programming', members: 125000, description: 'All about programming and development', icon: '💻' },
    { name: 'webdev', members: 89000, description: 'Web development discussions', icon: '🌐' },
    { name: 'javascript', members: 156000, description: 'JavaScript community', icon: '⚡' },
    { name: 'react', members: 78000, description: 'React.js discussions', icon: '⚛️' },
    { name: 'design', members: 45000, description: 'UI/UX Design community', icon: '🎨' },
  ];

  const samplePosts: Post[] = [
    {
      id: '1',
      title: 'Avoided a offline Scam today at Dadar Local!',
      content: 'Avoided an offline scam today at dadar local, with the posters being hanged at the train....',
      type: 'text',
      author: sampleUsers[0],
      community: 'webdev',
      upvotes: 1247,
      downvotes: 23,
      commentCount: 89,
      createdAt: new Date(Date.now() - 3600000),
      awards: 3
    },
    {
      id: '2',
      title: 'Best Practices for Cyber Threat Detection',
      content: 'Here are some key strategies I\'ve learned for strengthening cybersecurity: regularly update and patch systems, use strong authentication methods, monitor logs for suspicious activity, employ intrusion detection tools, and educate users to recognize phishing attempts.',
      type: 'text',
      author: sampleUsers[1],
      community: 'react',
      upvotes: 892,
      downvotes: 12,
      commentCount: 156,
      createdAt: new Date(Date.now() - 7200000),
      awards: 2
    },
    {
      id: '3',
      title: 'Powerful Cyber Threat Intelligence Tool I Discovered',
      content: 'Check out this incredible platform that makes detecting, analyzing, and responding to cyber threats faster and more efficient!',
      type: 'link',
      url: 'https://animate.style/',
      author: sampleUsers[2],
      community: 'design',
      upvotes: 634,
      downvotes: 8,
      commentCount: 67,
      createdAt: new Date(Date.now() - 10800000),
      awards: 1
    }
  ];

  const sampleComments: Comment[] = [
    {
      id: '1',
      content: 'This is really impressive! What tech stack did you use for the backend?',
      author: sampleUsers[1],
      upvotes: 45,
      downvotes: 2,
      createdAt: new Date(Date.now() - 3000000),
      replies: [
        {
          id: '2',
          content: 'I used Node.js with Express, MongoDB for the database, and Socket.io for real-time features.',
          author: sampleUsers[0],
          upvotes: 32,
          downvotes: 0,
          createdAt: new Date(Date.now() - 2700000),
          replies: [],
          level: 1,
          parentId: '1'
        }
      ],
      level: 0
    }
  ];

  // State
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [communities] = useState<Community[]>(sampleCommunities);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'link',
    url: '',
    community: 'programming'
  });

  const currentUser = sampleUsers[0]; // Mock current user

  // Helper functions
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote = post.userVote;

        if (voteType === 'up') {
          if (post.userVote === 'up') {
            newUpvotes -= 1;
            newUserVote = null;
          } else {
            newUpvotes += 1;
            if (post.userVote === 'down') newDownvotes -= 1;
            newUserVote = 'up';
          }
        } else {
          if (post.userVote === 'down') {
            newDownvotes -= 1;
            newUserVote = null;
          } else {
            newDownvotes += 1;
            if (post.userVote === 'up') newUpvotes -= 1;
            newUserVote = 'down';
          }
        }

        return { ...post, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
      }
      return post;
    }));
  };

  const handleCommentVote = (commentId: string, voteType: 'up' | 'down') => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          let newUpvotes = comment.upvotes;
          let newDownvotes = comment.downvotes;
          let newUserVote = comment.userVote;

          if (voteType === 'up') {
            if (comment.userVote === 'up') {
              newUpvotes -= 1;
              newUserVote = null;
            } else {
              newUpvotes += 1;
              if (comment.userVote === 'down') newDownvotes -= 1;
              newUserVote = 'up';
            }
          } else {
            if (comment.userVote === 'down') {
              newDownvotes -= 1;
              newUserVote = null;
            } else {
              newDownvotes += 1;
              if (comment.userVote === 'up') newUpvotes -= 1;
              newUserVote = 'down';
            }
          }

          return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
        }
        return { ...comment, replies: updateComments(comment.replies) };
      });
    };

    setComments(updateComments(comments));
  };

  const createPost = () => {
    if (!newPost.title.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      type: newPost.type,
      url: newPost.url,
      author: currentUser,
      community: newPost.community,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      commentCount: 0,
      createdAt: new Date(),
      awards: 0
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', type: 'text', url: '', community: 'programming' });
    setShowCreatePost(false);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: currentUser,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      createdAt: new Date(),
      replies: [],
      level: replyTo ? 1 : 0,
      parentId: replyTo || undefined
    };

    if (replyTo) {
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === replyTo) {
            return { ...c, replies: [...c.replies, comment] };
          }
          return { ...c, replies: addReply(c.replies) };
        });
      };
      setComments(addReply(comments));
    } else {
      setComments([comment, ...comments]);
    }

    setNewComment('');
    setReplyTo(null);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCommunity = selectedCommunity === 'all' || post.community === selectedCommunity;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommunity && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'new':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'top':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'hot':
      default:
        const scoreA = (a.upvotes - a.downvotes) / Math.pow((Date.now() - a.createdAt.getTime()) / 3600000 + 2, 1.8);
        const scoreB = (b.upvotes - b.downvotes) / Math.pow((Date.now() - b.createdAt.getTime()) / 3600000 + 2, 1.8);
        return scoreB - scoreA;
    }
  });

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{comment.author.avatar}</span>
          <span className="font-medium text-gray-900">{comment.author.username}</span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-500 text-sm">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-800 mb-3">{comment.content}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCommentVote(comment.id, 'up')}
              className={`p-1 rounded hover:bg-gray-100 ${comment.userVote === 'up' ? 'text-green-600' : 'text-gray-500'}`}
            >
              <ArrowUp size={16} />
            </button>
            <span className={`font-medium ${
              comment.userVote === 'up' ? 'text-green-600' : 
              comment.userVote === 'down' ? 'text-red-500' : 'text-gray-600'
            }`}>
              {comment.upvotes - comment.downvotes}
            </span>
            <button
              onClick={() => handleCommentVote(comment.id, 'down')}
              className={`p-1 rounded hover:bg-gray-100 ${comment.userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`}
            >
              <ArrowDown size={16} />
            </button>
          </div>
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <MessageCircle size={16} />
            Reply
          </button>
        </div>
        {replyTo === comment.id && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
              />
              <button
                onClick={addComment}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {comment.replies.map(reply => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white shadow-sm border-r border-gray-200 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home size={24} className="text-orange-500" />
              Communities
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCommunity('all')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCommunity === 'all' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <div className="font-medium">All Communities</div>
                    <div className="text-sm text-gray-500">View all posts</div>
                  </div>
                </div>
              </button>
              {communities.map(community => (
                <button
                  key={community.name}
                  onClick={() => setSelectedCommunity(community.name)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCommunity === community.name ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{community.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">r/{community.name}</div>
                      <div className="text-sm text-gray-500">{formatNumber(community.members)} members</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Trending Today</h3>
            <div className="space-y-2 text-sm">
              <div className="text-gray-600">#WebDevelopment</div>
              <div className="text-gray-600">#JavaScript</div>
              <div className="text-gray-600">#React</div>
              <div className="text-gray-600">#Programming</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <Filter size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Home size={20} className="text-white" />
                  </div>
                  DevForum
                </h1>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <Plus size={18} />
                Create Post
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Community..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                {['hot', 'new', 'top'].map(sort => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort as 'hot' | 'new' | 'top')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      sortBy === sort ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {sort === 'hot' && <TrendingUp size={16} className="inline mr-1" />}
                    {sort === 'new' && <Clock size={16} className="inline mr-1" />}
                    {sort === 'top' && <Award size={16} className="inline mr-1" />}
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="p-6">
          {selectedPost ? (
            <div>
              <button
                onClick={() => setSelectedPost(null)}
                className="mb-4 flex items-center gap-2 text-green-600 hover:text-green-700"
              >
                ← Back to feed
              </button>
              {(() => {
                const post = posts.find(p => p.id === selectedPost);
                return post && (
                  <div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleVote(post.id, 'up')}
                            className={`p-2 rounded hover:bg-gray-100 ${post.userVote === 'up' ? 'text-green-600' : 'text-gray-400'}`}
                          >
                            <ArrowUp size={20} />
                          </button>
                          <span className={`font-bold ${
                            post.userVote === 'up' ? 'text-green-600' : 
                            post.userVote === 'down' ? 'text-red-500' : 'text-gray-600'
                          }`}>
                            {formatNumber(post.upvotes - post.downvotes)}
                          </span>
                          <button
                            onClick={() => handleVote(post.id, 'down')}
                            className={`p-2 rounded hover:bg-gray-100 ${post.userVote === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            <ArrowDown size={20} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              r/{post.community}
                            </span>
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-500 text-sm">Posted by</span>
                            <div className="flex items-center gap-1">
                              <span className="text-lg">{post.author.avatar}</span>
                              <span className="font-medium text-gray-700">u/{post.author.username}</span>
                            </div>
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
                            {post.awards > 0 && (
                              <>
                                <span className="text-gray-500 text-sm">•</span>
                                <div className="flex items-center gap-1">
                                  <Award size={16} className="text-yellow-500" />
                                  <span className="text-sm font-medium">{post.awards}</span>
                                </div>
                              </>
                            )}
                          </div>
                          <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
                          {post.type === 'text' && (
                            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                          )}
                          {post.type === 'link' && (
                            <div>
                              <p className="text-gray-800 mb-3">{post.content}</p>
                              <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
                              >
                                🔗 {post.url}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Add a comment</h3>
                      <div className="flex gap-3">
                        <span className="text-2xl">{currentUser.avatar}</span>
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={addComment}
                              disabled={!newComment.trim()}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Comments ({comments.length})</h3>
                      {comments.map(comment => renderComment(comment))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-shadow">
                  <div className="flex">
                    <div className="flex flex-col items-center p-4 bg-black text-white">
                      <button
                        onClick={() => handleVote(post.id, 'up')}
                        className={`p-2 rounded hover:bg-gray-800 ${post.userVote === 'up' ? 'text-green-400' : 'text-gray-400'}`}
                      >
                        <ArrowUp size={20} />
                      </button>
                      <span className={`font-bold text-sm ${
                        post.userVote === 'up' ? 'text-green-400' : 
                        post.userVote === 'down' ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {formatNumber(post.upvotes - post.downvotes)}
                      </span>
                      <button
                        onClick={() => handleVote(post.id, 'down')}
                        className={`p-2 rounded hover:bg-gray-800 ${post.userVote === 'down' ? 'text-red-400' : 'text-gray-400'}`}
                      >
                        <ArrowDown size={20} />
                      </button>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          r/{post.community}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Posted by</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{post.author.avatar}</span>
                          <span className="font-medium text-gray-700">u/{post.author.username}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                        {post.awards > 0 && (
                          <>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <Award size={14} className="text-yellow-500" />
                              <span className="text-sm font-medium">{post.awards}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <h2 
                        className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-green-600 transition-colors"
                        onClick={() => setSelectedPost(post.id)}
                      >
                        {post.title}
                      </h2>
                      {post.type === 'text' && (
                        <p className="text-gray-700 line-clamp-3">{post.content}</p>
                      )}
                      {post.type === 'link' && (
                        <div>
                          <p className="text-gray-700 mb-2">{post.content}</p>
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
                          >
                            🔗 {post.url}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <button 
                          onClick={() => setSelectedPost(post.id)}
                          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                        >
                          <MessageCircle size={16} />
                          {post.commentCount} comments
                        </button>
                        <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                          <Share2 size={16} />
                          Share
                        </button>
                        <button 
                          className={`flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors ${
                            post.saved ? 'text-green-600' : ''
                          }`}
                          onClick={() => {
                            setPosts(posts.map(p => 
                              p.id === post.id ? { ...p, saved: !p.saved } : p
                            ));
                          }}
                        >
                          <Bookmark size={16} />
                          {post.saved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create a post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Community</label>
                <select
                  value={newPost.community}
                  onChange={(e) => setNewPost({...newPost, community: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {communities.map(community => (
                    <option key={community.name} value={community.name}>
                      r/{community.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setNewPost({...newPost, type: 'text'})}
                    className={`px-3 py-1 rounded-md text-sm ${
                      newPost.type === 'text' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setNewPost({...newPost, type: 'link'})}
                    className={`px-3 py-1 rounded-md text-sm ${
                      newPost.type === 'link' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Link
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="An interesting title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={300}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {newPost.title.length}/300
                </div>
              </div>
              {newPost.type === 'link' && (
                <div>
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <input
                    value={newPost.url}
                    onChange={(e) => setNewPost({...newPost, url: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newPost.type === 'link' ? 'Description (optional)' : 'Text (optional)'}
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder={newPost.type === 'link' ? 'Tell us more about this link...' : 'Text (optional)'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createPost}
                  disabled={!newPost.title.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedditClone;