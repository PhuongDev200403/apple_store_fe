/**
 * Helper functions for creating and parsing URL slugs
 */

/**
 * Convert Vietnamese text to URL-friendly slug
 * Example: "iPhone 14 Pro Max" -> "iphone-14-pro-max"
 */
export function createSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd') // Replace đ
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove duplicate hyphens
}

/**
 * Create product URL with category slug and product ID
 * Example: createProductUrl("iPhone 14 Pro", "iPhone", 123)
 * Returns: "/san-pham/iphone/iphone-14-pro-123"
 */
export function createProductUrl(productName, categoryName, productId) {
  const categorySlug = createSlug(categoryName);
  const productSlug = createSlug(productName);
  return `/san-pham/${categorySlug}/${productSlug}-${productId}`;
}

/**
 * Extract product ID from slug
 * Example: "iphone-14-pro-max-123" -> 123
 */
export function extractIdFromSlug(slug) {
  if (!slug) return null;
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  return isNaN(id) ? null : id;
}

/**
 * Create category URL
 * Example: createCategoryUrl("iPhone") -> "/san-pham/iphone"
 */
export function createCategoryUrl(categoryName) {
  const categorySlug = createSlug(categoryName);
  return `/san-pham/${categorySlug}`;
}
