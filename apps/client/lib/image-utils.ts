/**
 * Resolves the best image URL for a product or offer.
 * Priority: Cloudinary images[] array → legacy imagePath → legacy imageUrl → fallback
 */
import { API_URL } from "./api-config";

export function getImageUrl(item: {
  images?: string[];
  imagePath?: string;
  imageUrl?: string;
}, fallback = "/placeholder-pizza.jpg"): string {
  if (item.images && item.images.length > 0) {
    return item.images[0];
  }
  if (item.imagePath) {
    return `${API_URL}${item.imagePath}`;
  }
  return item.imageUrl || fallback;
}

export function getAllImages(item: {
  images?: string[];
  imagePath?: string;
  imageUrl?: string;
}): string[] {
  if (item.images && item.images.length > 0) {
    return item.images;
  }
  const single = item.imagePath
    ? `${API_URL}${item.imagePath}`
    : item.imageUrl;
  return single ? [single] : [];
}
