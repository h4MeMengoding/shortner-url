'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { UrlResponse, UpdateUrlRequest } from '@/types';

interface EditUrlFormProps {
  url: UrlResponse;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUrl: UrlResponse) => void;
}

const EditUrlForm: React.FC<EditUrlFormProps> = ({ url, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    expiresAt: string;
  }>({
    title: '',
    description: '',
    expiresAt: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      setFormData({
        title: url.title || '',
        description: url.description || '',
        expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().split('T')[0] : '',
      });
    }
  }, [url]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.expiresAt) {
      const expirationDate = new Date(formData.expiresAt);
      const currentDate = new Date();
      if (expirationDate <= currentDate) {
        newErrors.expiresAt = 'Expiration date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const updateData: UpdateUrlRequest = {
        title: formData.title || null,
        description: formData.description || null,
        expiresAt: formData.expiresAt || null,
      };

      const response = await fetch(`/api/urls/${url.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.data);
        onClose();
      } else {
        setErrors({ submit: data.error || 'Failed to update URL' });
      }
    } catch (error: unknown) {
      console.error('Update URL error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      title: url?.title || '',
      description: url?.description || '',
      expiresAt: url?.expiresAt ? new Date(url.expiresAt).toISOString().split('T')[0] : '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit URL"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Info (Read-only) */}
        <div className="space-y-2">
          <div className="bg-navy-900 p-4 rounded-lg border border-gray-700">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-400">Short URL</label>
                <p className="text-blue-400 font-mono">{url?.shortUrl}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Original URL</label>
                <p className="text-gray-300 text-sm break-all">{url?.originalUrl}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title <span className="text-gray-500">(optional)</span>
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Give your URL a memorable title"
            error={errors.title}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Add a description for your URL"
            rows={3}
            error={errors.description}
          />
        </div>

        {/* Expiration Date */}
        <div className="space-y-2">
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-300">
            Expiration Date <span className="text-gray-500">(optional)</span>
          </label>
          <Input
            id="expiresAt"
            type="date"
            value={formData.expiresAt}
            onChange={(e) => handleInputChange('expiresAt', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            error={errors.expiresAt}
          />
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update URL
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUrlForm;
