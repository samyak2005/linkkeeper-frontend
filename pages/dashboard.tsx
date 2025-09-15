import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Bookmark {
  _id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to access your bookmarks');
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://linkkeeper-api.onrender.com/api';
      const response = await fetch(`${baseUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadBookmarks(token);
      } else {
        setError('Authentication failed. Please login again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to check authentication');
      setLoading(false);
    }
  };

  const loadBookmarks = async (token: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://linkkeeper-api.onrender.com/api';
      const response = await fetch(`${baseUrl}/links`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      } else {
        setError('Failed to load bookmarks');
      }
    } catch (err) {
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`/api/links/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b._id !== bookmarkId));
        setShowDeleteConfirm(null);
      } else {
        setError('Failed to delete bookmark');
      }
    } catch (err) {
      setError('Failed to delete bookmark');
    }
  };

  const updateBookmark = async (bookmarkId: string, updatedData: Partial<Bookmark>) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`/api/links/${bookmarkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(bookmarks.map(b => b._id === bookmarkId ? data.bookmark : b));
        setEditingBookmark(null);
      } else {
        setError('Failed to update bookmark');
      }
    } catch (err) {
      setError('Failed to update bookmark');
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-green-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">Please login to access your bookmarks</p>
          <Link
            href="/login"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - LinkKeeper</title>
        <meta name="description" content="Manage your bookmarks" />
      </Head>

      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
            <div className="flex gap-4">
              <Link
                href="/add-bookmark"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              >
                + Add Bookmark
              </Link>
              <Link
                href="/bookmarklet"
                className="border border-green-500 text-green-400 px-6 py-2 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                📌 Bookmarklet
              </Link>
              <Link
                href="/"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Bookmarks Grid */}
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔖</div>
              <h2 className="text-2xl font-bold text-white mb-2">No bookmarks found</h2>
              <p className="text-gray-300 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by installing the Chrome extension to save bookmarks'}
              </p>
              <a
                href="https://chrome.google.com/webstore/detail/linkkeeper-bookmark-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Install Extension
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors relative group"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBookmark(bookmark)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                        title="Edit bookmark"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(bookmark._id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                        title="Delete bookmark"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 pr-16">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-400 transition-colors"
                    >
                      {bookmark.title}
                    </a>
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {bookmark.description || 'No description'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {bookmark.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit Bookmark Modal */}
          {editingBookmark && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-white mb-4">Edit Bookmark</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  updateBookmark(editingBookmark._id, {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag)
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingBookmark.title}
                        required
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        defaultValue={editingBookmark.description}
                        rows={3}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        defaultValue={editingBookmark.tags.join(', ')}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBookmark(null)}
                      className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-white mb-4">Delete Bookmark</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this bookmark? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => deleteBookmark(showDeleteConfirm)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
