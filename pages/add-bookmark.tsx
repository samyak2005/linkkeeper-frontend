import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AddBookmark() {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to add bookmarks');
        setLoading(false);
        return;
      }

      const bookmarkData = {
        url: formData.url.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://linkkeeper-api.onrender.com/api';
      const response = await fetch(`${baseUrl}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookmarkData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Bookmark added successfully!');
        setFormData({ url: '', title: '', description: '', tags: '' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add bookmark');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const extractPageData = async () => {
    if (!formData.url) {
      setError('Please enter a URL first');
      return;
    }

    try {
      setLoading(true);
      // This would typically call a backend endpoint that scrapes the page
      // For now, we'll just set a placeholder
      setFormData(prev => ({
        ...prev,
        title: prev.title || 'Loading...',
        description: prev.description || 'Loading page data...'
      }));
      
      // Simulate API call
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          title: prev.title === 'Loading...' ? 'Page Title' : prev.title,
          description: prev.description === 'Loading page data...' ? 'Page description will be extracted here' : prev.description
        }));
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to extract page data');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Bookmark - LinkKeeper</title>
        <meta name="description" content="Add a new bookmark to LinkKeeper" />
      </Head>

      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Add New Bookmark</h1>
            <Link
              href="/dashboard"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Form */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="url"
                    required
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={extractPageData}
                    disabled={loading || !formData.url}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Extract
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Bookmark title"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas (e.g., web, design, tutorial)"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Separate multiple tags with commas
                </p>
              </div>

              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Quick Tips</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Use the "Extract" button to automatically get page title and description</li>
              <li>• Add relevant tags to make your bookmarks easier to find</li>
              <li>• Use descriptive titles for better organization</li>
              <li>• You can always edit bookmarks later from your dashboard</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
