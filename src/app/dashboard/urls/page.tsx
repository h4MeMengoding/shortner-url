'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';
import EditUrlForm from '@/components/dashboard/EditUrlForm';
import { 
  Copy, 
  QrCode, 
  Trash2, 
  Edit, 
  Search,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { UrlResponse } from '@/types';
import { copyToClipboard, formatDate } from '@/lib/utils';

export default function UrlsPage() {
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<UrlResponse | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls');
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
      await copyToClipboard(url);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDeleteUrl = async () => {
    if (!selectedUrl) return;

    try {
      const response = await fetch(`/api/urls/${selectedUrl.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setUrls(urls.filter(url => url.id !== selectedUrl.id));
        setShowDeleteModal(false);
        setSelectedUrl(null);
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const handleToggleActive = async (url: UrlResponse) => {
    try {
      const response = await fetch(`/api/urls/${url.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !url.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUrls(urls.map(u => u.id === url.id ? { ...u, isActive: !u.isActive } : u));
      }
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  const handleUpdateUrl = (updatedUrl: UrlResponse) => {
    setUrls(urls.map(u => u.id === updatedUrl.id ? updatedUrl : u));
  };

  const filteredUrls = urls.filter(url =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">My URLs</h1>
          <p className="text-gray-400 mt-2">
            Manage and track your shortened URLs
          </p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/create'}>
          Create New URL
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search URLs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {/* URLs List */}
      <div className="space-y-4">
        {filteredUrls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'No URLs found matching your search.' : 'No URLs created yet.'}
              </p>
              {!searchTerm && (
                <Button
                  className="mt-4"
                  onClick={() => window.location.href = '/dashboard/create'}
                >
                  Create Your First URL
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredUrls.map((url, index) => (
            <Card key={url.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* URL Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-100 truncate">
                        {url.originalUrl.length > 50 
                          ? `${url.originalUrl.substring(0, 50)}...` 
                          : url.originalUrl}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        url.isActive 
                          ? 'bg-green-900/30 text-green-400 border border-green-700' 
                          : 'bg-red-900/30 text-red-400 border border-red-700'
                      }`}>
                        {url.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {url.shortUrl}
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyUrl(url.shortUrl, url.id)}
                        >
                          <Copy size={14} />
                          {copySuccess === url.id ? 'Copied!' : ''}
                        </Button>
                      </div>
                      
                      <p className="text-gray-400 text-sm break-all">
                        {url.originalUrl}
                      </p>
                      
                      {url.description && (
                        <p className="text-gray-400 text-sm">
                          {url.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{url.clicks} clicks</span>
                        <span>Created {formatDate(url.createdAt)}</span>
                        {url.expiresAt && (
                          <span>Expires {formatDate(url.expiresAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUrl(url);
                        setShowQRCode(true);
                      }}
                    >
                      <QrCode size={16} />
                    </Button>
                    
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveDropdown(activeDropdown === url.id ? null : url.id)}
                      >
                        <MoreVertical size={16} />
                      </Button>
                      
                      {activeDropdown === url.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-navy-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10">
                          <button
                            onClick={() => {
                              setSelectedUrl(url);
                              setShowEditModal(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-navy-700 flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleToggleActive(url);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-navy-700 flex items-center gap-2"
                          >
                            {url.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                            {url.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUrl(url);
                              setShowDeleteModal(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-navy-700 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* QR Code Modal */}
      {selectedUrl && (
        <QRCodeDisplay
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          url={selectedUrl.shortUrl}
          urlId={selectedUrl.id}
        />
      )}

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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete URL"
      >
        {selectedUrl && (
          <div className="space-y-4">
            <p className="text-gray-100">
              Are you sure you want to delete this URL? This action cannot be undone.
            </p>
            <div className="bg-navy-900 p-3 rounded border border-gray-700">
              <p className="text-blue-400 font-medium">{selectedUrl.shortUrl}</p>
              <p className="text-gray-400 text-sm break-all">{selectedUrl.originalUrl}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDeleteUrl}
                className="flex-1"
              >
                Delete URL
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}
