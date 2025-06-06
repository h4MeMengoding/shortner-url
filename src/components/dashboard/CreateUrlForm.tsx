'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link, Loader2, Copy, ExternalLink, QrCode, Shuffle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import QRCodeDisplay from './QRCodeDisplay';
import { CreateUrlRequest, UrlResponse } from '@/types';
import { isValidUrl, copyToClipboard, generateShortCode } from '@/lib/utils';

const CreateUrlForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateUrlRequest>({
    originalUrl: '',
    shortLink: generateShortCode(), // Default generated short code
    description: '',
    expiresAt: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<UrlResponse | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.originalUrl) {
      newErrors.originalUrl = 'URL is required';
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL';
    }

    if (formData.shortLink && (formData.shortLink.length < 3 || formData.shortLink.length > 50)) {
      newErrors.shortLink = 'Short link must be between 3 and 50 characters';
    }

    if (formData.shortLink && !/^[a-zA-Z0-9_-]+$/.test(formData.shortLink)) {
      newErrors.shortLink = 'Short link can only contain letters, numbers, hyphens, and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setCreatedUrl(data.data);
        setShowResult(true);
        // Reset form
        setFormData({
          originalUrl: '',
          shortLink: generateShortCode(), // Generate new default short code
          description: '',
          expiresAt: '',
        });
      } else {
        setErrors({ submit: data.error || 'Failed to create short URL' });
      }
    } catch (error: unknown) {
      console.error('Create URL error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUrlRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRandomizeShortLink = () => {
    const newShortCode = generateShortCode();
    setFormData(prev => ({ ...prev, shortLink: newShortCode }));
    if (errors.shortLink) {
      setErrors(prev => ({ ...prev, shortLink: '' }));
    }
  };

  const handleCopyUrl = async () => {
    if (createdUrl) {
      try {
        await copyToClipboard(createdUrl.shortUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Link className="w-5 h-5 text-white" />
            </div>
            Create Short URL
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Transform your long URLs into short, shareable links
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Original URL */}
            <Input
              label="Original URL *"
              placeholder="https://example.com/very-long-url"
              value={formData.originalUrl}
              onChange={(e) => handleInputChange('originalUrl', e.target.value)}
              error={errors.originalUrl}
              icon={<ExternalLink size={16} />}
            />

            {/* Short Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Short Link (Optional)
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">{process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'}/</span>
                  </div>
                  <Input
                    placeholder="my-custom-link"
                    value={formData.shortLink}
                    onChange={(e) => handleInputChange('shortLink', e.target.value)}
                    error={errors.shortLink}
                    className="pl-32"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRandomizeShortLink}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <Shuffle size={16} />
                  Random
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Leave empty to use a randomly generated code, or customize it to your preference
              </p>
            </div>

            {/* Description */}
            <Textarea
              label="Description (Optional)"
              placeholder="Brief description of what this link leads to..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />

            {/* Expiration Date */}
            <Input
              label="Expiration Date (Optional)"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => handleInputChange('expiresAt', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Short URL'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="URL Created Successfully!"
        size="lg"
      >
        {createdUrl && (
          <div className="space-y-6">
            {/* URL Display */}
            <div className="bg-navy-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">
                  Short URL
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                  >
                    <Copy size={14} className="mr-1" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowQRCode(true)}
                  >
                    <QrCode size={14} className="mr-1" />
                    QR Code
                  </Button>
                </div>
              </div>
              <a
                href={createdUrl.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 break-all text-lg font-medium"
              >
                {createdUrl.shortUrl}
              </a>
            </div>

            {/* URL Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Original URL:</span>
                <p className="text-gray-100 break-all mt-1">
                  {createdUrl.originalUrl}
                </p>
              </div>
              {createdUrl.description && (
                <div className="md:col-span-2">
                  <span className="text-gray-400">Description:</span>
                  <p className="text-gray-100 mt-1">{createdUrl.description}</p>
                </div>
              )}
              <div>
                <span className="text-gray-400">Created:</span>
                <p className="text-gray-100 mt-1">
                  {new Date(createdUrl.createdAt).toLocaleString()}
                </p>
              </div>
              {createdUrl.expiresAt && (
                <div>
                  <span className="text-gray-400">Expires:</span>
                  <p className="text-gray-100 mt-1">
                    {new Date(createdUrl.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => window.open('/dashboard/urls', '_blank')}
                className="flex-1"
              >
                View All URLs
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowResult(false)}
                className="flex-1"
              >
                Create Another
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Code Modal */}
      {createdUrl && (
        <QRCodeDisplay
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          url={createdUrl.shortUrl}
          urlId={createdUrl.id}
        />
      )}
    </>
  );
};

export default CreateUrlForm;
