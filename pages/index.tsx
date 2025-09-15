import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>LinkKeeper - Bookmark Manager</title>
        <meta name="description" content="Save and organize bookmarks with tags, descriptions, and search functionality" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{backgroundColor: '#1f2937'}}>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
              LinkKeeper
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The ultimate bookmark manager with cloud sync, advanced search, and beautiful GenZ-inspired design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/login"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-green-500 text-green-400 px-8 py-3 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
              <div className="text-green-400 text-3xl mb-4">🔖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Bookmarking</h3>
              <p className="text-gray-300">
                Save bookmarks with auto-filled titles, descriptions, and custom tags. Use our bookmarklet for quick saving from any website.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
              <div className="text-green-400 text-3xl mb-4">☁️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Cloud Sync</h3>
              <p className="text-gray-300">
                Access your bookmarks anywhere with real-time sync across all your devices and browsers.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
              <div className="text-green-400 text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Search</h3>
              <p className="text-gray-300">
                Find any bookmark instantly with powerful search, filters, and tag-based organization.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose LinkKeeper?</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-300">Free</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
                <div className="text-gray-300">Unlimited Bookmarks</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">⚡</div>
                <div className="text-gray-300">Lightning Fast</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">🔒</div>
                <div className="text-gray-300">Secure & Private</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 LinkKeeper. Built with ❤️ for productivity enthusiasts.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
