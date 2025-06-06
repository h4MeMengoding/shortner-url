export interface CreateUrlRequest {
  originalUrl: string;
  customCode?: string;
  title?: string;
  description?: string;
  expiresAt?: string;
}

export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  customCode?: string;
  shortUrl: string;
  title?: string;
  description?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  qrCode?: string;
}

export interface UserStats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  recentUrls: UrlResponse[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
