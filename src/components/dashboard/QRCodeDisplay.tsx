'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  urlId: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  isOpen,
  onClose,
  url,
  urlId,
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQRCode = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/urls/${urlId}/qr`);
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.data.qrCode);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
    } finally {
      setLoading(false);
    }
  }, [urlId]);

  useEffect(() => {
    if (isOpen && !qrCode) {
      fetchQRCode();
    }
  }, [isOpen, qrCode, fetchQRCode]);

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.download = `qr-code-${urlId}.png`;
      link.href = qrCode;
      link.click();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QR Code"
      size="md"
    >
      <div className="text-center space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : qrCode ? (
          <>
            <div className="bg-white p-4 rounded-lg inline-block">
              <Image
                src={qrCode}
                alt="QR Code"
                width={256}
                height={256}
                className="w-64 h-64"
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">
                Scan this QR code to access:
              </p>
              <p className="text-blue-400 break-all font-medium">
                {url}
              </p>
            </div>
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="w-full"
            >
              <Download size={16} className="mr-2" />
              Download QR Code
            </Button>
          </>
        ) : (
          <div className="text-gray-400 h-64 flex items-center justify-center">
            Failed to generate QR code
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QRCodeDisplay;
