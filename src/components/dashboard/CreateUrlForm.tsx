'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link, Loader2, Copy, ExternalLink, QrCode } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import QRCodeDisplay from './QRCodeDisplay';
import { CreateUrlRequest, UrlResponse } from '@/types';
import { isValidUrl, copyToClipboard } from '@/lib/utils';

const CreateUrlForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateUrlRequest>({
    originalUrl: '',
    customCode: '',
    title: '',
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

    if (formData.customCode && (formData.customCode.length < 3 || formData.customCode.length > 50)) {
      newErrors.customCode = 'Custom code must be between 3 and 50 characters';
    }

    if (formData.customCode && !/^[a-zA-Z0-9_-]+$/.test(formData.customCode)) {
      newErrors.customCode = 'Custom code can only contain letters, numbers, hyphens, and underscores';
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
          customCode: '',
          title: '',
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

            {/* Custom Code */}
            <Input
              label="Custom Code (Optional)"
              placeholder="my-custom-link"
              value={formData.customCode}
              onChange={(e) => handleInputChange('customCode', e.target.value)}
              error={errors.customCode}
              icon={<Link size={16} />}
            />

            {/* Title */}
            <Input
              label="Title (Optional)"
              placeholder="My Awesome Link"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

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
              {createdUrl.title && (
                <div>
                  <span className="text-gray-400">Title:</span>
                  <p className="text-gray-100 mt-1">{createdUrl.title}</p>
                </div>
              )}
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
