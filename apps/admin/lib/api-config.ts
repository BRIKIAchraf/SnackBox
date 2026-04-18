let rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-production-48c5.up.railway.app';
if (rawUrl && !rawUrl.startsWith('http')) {
    rawUrl = `https://${rawUrl}`;
}
export const API_URL = rawUrl;
export const API_BASE = `${API_URL}/api/v1`;
export const SOCKET_URL = API_URL;
