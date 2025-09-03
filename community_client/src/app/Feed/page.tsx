"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { communityService } from '@/api/CommunityService';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [allComments, setAllComments] = useState<any[]>([]);
  const [allReplies, setAllReplies] = useState<any[]>([]);

  // Create Post form state
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [communityId, setCommunityId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [creating, setCreating] = useState<boolean>(false);


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);
  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        setLoading(true);
        const [postsRes, communitiesRes, commentsRes, repliesRes] = await Promise.all([
          communityService.getPosts(token),
          communityService.getCommunities(token),
          communityService.listComments(token),
          communityService.listReplies(token),
        ]);
        setPosts(Array.isArray(postsRes) ? postsRes : []);
        setCommunities(Array.isArray(communitiesRes) ? communitiesRes : []);
        setAllComments(Array.isArray(commentsRes) ? commentsRes : []);
        setAllReplies(Array.isArray(repliesRes) ? repliesRes : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const refreshPosts = async () => {
    if (!token) return;
    try {
      const [postsRes, commentsRes, repliesRes] = await Promise.all([
        communityService.getPosts(token),
        communityService.listComments(token),
        communityService.listReplies(token),
      ]);
      setPosts(Array.isArray(postsRes) ? postsRes : []);
      setAllComments(Array.isArray(commentsRes) ? commentsRes : []);
      setAllReplies(Array.isArray(repliesRes) ? repliesRes : []);
    } catch (e) {
      // ignore
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !communityId) return;
    try {
      setCreating(true);
      const created = await communityService.createPost(token, {
        community: parseInt(communityId, 10),
        title,
        content,
      } as any);

      if (files.length > 0 && created?.id) {
        try {
          await communityService.uploadPostFiles(token, created.id, files);
        } catch (fileErr) {
          console.error('File upload failed:', fileErr);
        }
      }

      // Refresh posts (or prepend)
      setPosts(prev => [created, ...prev]);
      setShowCreate(false);
      setCommunityId('');
      setTitle('');
      setContent('');
      setFiles([]);
    } catch (e: any) {
      setError(e?.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleVote = async (post: any, value: number) => {
    if (!token) return;
    try {
      const current = post.user_vote; // expect { id, value } or null
      if (current && current.value === value) {
        // toggle off => delete
        await communityService.deletePostVote(token, current.id);
      } else if (current && current.id) {
        await communityService.updatePostVote(token, current.id, value);
      } else {
        await communityService.votePost(token, { post: post.id, value });
      }
      await refreshPosts();
    } catch (e) {
      console.error('vote action failed', e);
    }
  };

  const handleSavePost = async (post: any) => {
    if (!token) return;
    try {
      if (post.user_saved) {
        // find saved id then delete
        const savedList = await communityService.listSavedPosts(token);
        const found = Array.isArray(savedList) ? savedList.find((s: any) => s.post === post.id) : null;
        if (found?.id) {
          await communityService.deleteSavedPost(token, found.id);
        }
      } else {
        await communityService.savePost(token, { post: post.id });
      }
      await refreshPosts();
    } catch (e) {
      console.error('save/unsave failed', e);
    }
  };

  const handleAddComment = async (post: any) => {
    if (!token) return;
    const contentVal = commentDrafts[post.id]?.trim();
    if (!contentVal) return;
    try {
      await communityService.createComment(token, { post: post.id, content: contentVal });
      setCommentDrafts(prev => ({ ...prev, [post.id]: '' }));
      await refreshPosts();
    } catch (e) {
      console.error('add comment failed', e);
    }
  };

  const handleAddReply = async (comment: any) => {
    if (!token) return;
    const contentVal = replyDrafts[comment.id]?.trim();
    if (!contentVal) return;
    try {
      await communityService.createReply(token, { comment: comment.id, content: contentVal });
      setReplyDrafts(prev => ({ ...prev, [comment.id]: '' }));
      await refreshPosts();
    } catch (e) {
      console.error('add reply failed', e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Feed</h1>
        <p className="text-gray-400">Please login to view and create posts.</p>
        <Link className="text-blue-400 underline" href="/Login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20">
          {showCreate ? 'Close' : 'Create Post'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-8 p-4 border border-gray-700 rounded-lg">
          <div className="grid gap-3">
            <select
              className="px-3 py-2 rounded bg-black/30 border border-gray-700"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              required
            >
              <option value="" disabled>Select community</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              className="px-3 py-2 rounded bg-black/30 border border-gray-700"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="px-3 py-2 rounded bg-black/30 border border-gray-700 min-h-[120px]"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              className="px-3 py-2 rounded bg-black/30 border border-gray-700"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
            />
          </div>
          <div className="mt-4">
            <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">
              {creating ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-rose-400 mb-4">{error}</p>}

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-white/5 flex items-center justify-between">
              <div className="text-sm text-gray-400">Community: {p.community_name}</div>
              <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{p.content}</p>
              {Array.isArray(p.files) && p.files.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {p.files.map((f: any, idx: number) => (
                    <img key={idx} src={f.file} alt="attachment" className="rounded border border-gray-700" />
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-700 text-sm text-gray-300 flex items-center gap-4">
              <button
                onClick={() => handleVote(p, 1)}
                className={`px-3 py-1 rounded ${p.user_vote?.value === 1 ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
              >
                👍 {p.votes_like_count}
              </button>
              <button
                onClick={() => handleVote(p, -1)}
                className={`px-3 py-1 rounded ${p.user_vote?.value === -1 ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
              >
                👎 {p.votes_dislike_count}
              </button>
              <button
                onClick={() => handleSavePost(p)}
                className={`px-3 py-1 rounded ${p.user_saved ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
              >
                💾 {p.saved_count}
              </button>
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="text-sm font-medium mb-2">Comments</div>
              <div className="space-y-3 mb-3">
                {allComments.filter((c) => c.post === p.id).map((c: any) => {
                  const replies = allReplies.filter((r) => r.comment === c.id);
  return (
                    <div key={c.id} className="text-sm text-gray-300">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400">#{c.id}</span>
                        <div className="flex-1">{c.content}</div>
                      </div>
                      {/* Replies */}
                      <div className="mt-2 ml-6 space-y-2">
                        {replies.map((r: any) => (
                          <div key={r.id} className="text-xs text-gray-400">
                            <span className="text-gray-500">↳ #{r.id}</span> {r.content}
                          </div>
                        ))}
                        <div className="flex gap-2 mt-1">
                          <input
                            className="flex-1 px-3 py-1.5 rounded bg-black/30 border border-gray-700 text-xs"
                            placeholder="Reply..."
                            value={replyDrafts[c.id] || ''}
                            onChange={(e) => setReplyDrafts(prev => ({ ...prev, [c.id]: e.target.value }))}
                          />
                          <button onClick={() => handleAddReply(c)} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs">Reply</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {allComments.filter((c) => c.post === p.id).length === 0 && (
                  <div className="text-sm text-gray-500">No comments yet.</div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded bg-black/30 border border-gray-700 text-sm"
                  placeholder="Add a comment"
                  value={commentDrafts[p.id] || ''}
                  onChange={(e) => setCommentDrafts(prev => ({ ...prev, [p.id]: e.target.value }))}
                />
                <button onClick={() => handleAddComment(p)} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm">Post</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
