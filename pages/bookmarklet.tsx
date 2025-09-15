import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Bookmarklet() {
  const [copied, setCopied] = useState(false);

  const bookmarkletCode = `javascript:(function(){
    var url = window.location.href;
    var title = document.title;
    var description = '';
    
    // Try to get description from meta tags
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      description = metaDesc.getAttribute('content') || '';
    }
    
    // Try Open Graph description
    if (!description) {
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        description = ogDesc.getAttribute('content') || '';
      }
    }
    
    // Open LinkKeeper in new window with pre-filled data
    var linkkeeperUrl = '${process.env.NEXT_PUBLIC_APP_URL || 'https://linkkeeper-frontend-pi.vercel.app'}/add-bookmark?';
    var params = new URLSearchParams({
      url: url,
      title: title,
      description: description
    });
    
    window.open(linkkeeperUrl + params.toString(), '_blank', 'width=800,height=600');
  })();`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      <Head>
        <title>Bookmarklet - LinkKeeper</title>
        <meta name="description" content="Quick bookmarking with LinkKeeper bookmarklet" />
      </Head>

      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">LinkKeeper Bookmarklet</h1>
            <Link
              href="/dashboard"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* What is Bookmarklet */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📌 What is a Bookmarklet?</h2>
            <p className="text-gray-300 mb-4">
              A bookmarklet is a small JavaScript program that can be saved as a bookmark in your browser. 
              It allows you to quickly save the current webpage to LinkKeeper without leaving the page.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Drag the bookmarklet to your bookmarks bar</li>
                <li>When you want to save a page, click the bookmarklet</li>
                <li>LinkKeeper opens in a new window with the page data pre-filled</li>
                <li>Add tags and description, then save!</li>
              </ol>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Chrome/Edge */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🌐 Chrome / Edge / Brave</h3>
              <ol className="space-y-3 text-gray-300">
                <li>1. Right-click on your bookmarks bar</li>
                <li>2. Select "Add page" or "Add bookmark"</li>
                <li>3. Name it "Save to LinkKeeper"</li>
                <li>4. Paste the bookmarklet code in the URL field</li>
                <li>5. Save the bookmark</li>
              </ol>
            </div>

            {/* Firefox */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🦊 Firefox</h3>
              <ol className="space-y-3 text-gray-300">
                <li>1. Right-click on your bookmarks toolbar</li>
                <li>2. Select "New Bookmark"</li>
                <li>3. Name it "Save to LinkKeeper"</li>
                <li>4. Paste the bookmarklet code in the Location field</li>
                <li>5. Save the bookmark</li>
              </ol>
            </div>
          </div>

          {/* Bookmarklet Code */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Bookmarklet Code</h3>
              <button
                onClick={copyToClipboard}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                <code>{bookmarkletCode}</code>
              </pre>
            </div>
          </div>

          {/* Drag and Drop Bookmarklet */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Install (Drag & Drop)</h3>
            <p className="text-gray-300 mb-4">
              Drag the button below to your bookmarks bar for instant installation:
            </p>
            
            <div className="text-center">
              <a
                href={bookmarkletCode}
                className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 cursor-move"
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/uri-list', bookmarkletCode);
                  e.dataTransfer.setData('text/plain', 'Save to LinkKeeper');
                }}
              >
                📌 Save to LinkKeeper
              </a>
            </div>
            
            <p className="text-sm text-gray-400 mt-4 text-center">
              Drag this button to your bookmarks bar
            </p>
          </div>

          {/* Alternative Methods */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">🔄 Alternative Methods</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">📱 Mobile Browsers</h4>
                <p className="text-gray-300 mb-2">
                  Bookmarklets don't work on mobile browsers. Instead:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Copy the page URL</li>
                  <li>Open LinkKeeper web app</li>
                  <li>Paste the URL in the add bookmark form</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">🔗 Direct Link</h4>
                <p className="text-gray-300 mb-2">
                  You can also bookmark this page and use it as a quick launcher:
                </p>
                <Link
                  href="/add-bookmark"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  LinkKeeper Add Bookmark Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
