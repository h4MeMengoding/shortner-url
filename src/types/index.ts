export interface CreateUrlRequest {
  originalUrl: string;
  shortLink?: string;
  description?: string;
  expiresAt?: string;
}

export interface UpdateUrlRequest {
  description?: string | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  customCode?: string;
  shortUrl: string;
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
