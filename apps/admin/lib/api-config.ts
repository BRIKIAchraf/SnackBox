let rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
if (rawUrl && !rawUrl.startsWith('http')) {
    rawUrl = `https://${rawUrl}`;
}
export const API_URL = rawUrl;
export const API_BASE = `${API_URL}/api/v1`;
export const SOCKET_URL = API_URL;
