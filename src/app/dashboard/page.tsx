'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import StatsCards from '@/components/dashboard/StatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowRight, ExternalLink, Copy, Edit } from 'lucide-react';
import Link from 'next/link';
import { UrlResponse } from '@/types';
import EditUrlForm from '@/components/dashboard/EditUrlForm';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<UrlResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls?limit=5');
      const data = await response.json();
      
      if (data.success) {
        setUrls(data.data.urls);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleUpdateUrl = (updatedUrl: UrlResponse) => {
    setUrls(urls.map(u => u.id === updatedUrl.id ? updatedUrl : u));
    setShowEditModal(false);
    setSelectedUrl(null);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="space-y-8 animate-fade-in w-full max-w-none">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 break-words">
              Welcome back, {session?.user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Manage your shortened URLs and track their performance
            </p>
          </div>
          <div className="flex-shrink-0 w-full lg:w-auto">
            <Link href="/dashboard/create" className="block w-full lg:w-auto">
              <Button size="lg" className="flex items-center justify-center gap-2 w-full lg:w-auto">
                <Plus size={20} />
                Create Short URL
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="w-full">
          <StatsCards />
        </div>

        {/* Recent URLs */}
        <Card className="animate-slide-up w-full" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent URLs</span>
              <Link href="/dashboard/urls" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                  View All
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-700 rounded"></div>
                        <div className="h-8 w-8 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No URLs created yet</p>
                <Link href="/dashboard/create">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Create Your First URL
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {urls.map((url) => (
                  <div 
                    key={url.id} 
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-100 truncate">
                          {url.shortCode}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          url.isActive 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {url.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <p className="text-blue-400 text-sm font-mono mb-1">{url.shortUrl}</p>
                      <p className="text-gray-400 text-sm truncate">{url.originalUrl}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{url.clicks} clicks</span>
                        <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                        {url.expiresAt && (
                          <span>Expires: {new Date(url.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(url.shortUrl, url.id)}
                        className={`transition-colors ${
                          copySuccess === url.id 
                            ? 'text-green-400 hover:text-green-300' 
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title="Copy URL"
                      >
                        <Copy size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUrl(url);
                          setShowEditModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-300"
                        title="Edit URL"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(url.shortUrl, '_blank')}
                        className="text-gray-400 hover:text-gray-300"
                        title="Open URL"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                {urls.length === 5 && (
                  <div className="text-center pt-4 border-t border-gray-700">
                    <Link href="/dashboard/urls">
                      <Button variant="outline" size="sm">
                        View All URLs
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit URL Modal */}
        {selectedUrl && (
          <EditUrlForm
            url={selectedUrl}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUrl(null);
            }}
            onUpdate={handleUpdateUrl}
          />
        )}
      </div>
    </div>
  );
}
