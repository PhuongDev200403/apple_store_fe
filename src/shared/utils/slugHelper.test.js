/**
 * Test examples for slug helper functions
 */

import { createSlug, createProductUrl, extractIdFromSlug, createCategoryUrl } from './slugHelper';

// Test createSlug
console.log('=== Test createSlug ===');
console.log(createSlug('iPhone 14 Pro Max')); // -> "iphone-14-pro-max"
console.log(createSlug('MacBook Air M2')); // -> "macbook-air-m2"
console.log(createSlug('Điện thoại Samsung Galaxy S23')); // -> "dien-thoai-samsung-galaxy-s23"
console.log(createSlug('Laptop Dell XPS 15')); // -> "laptop-dell-xps-15"

// Test createProductUrl
console.log('\n=== Test createProductUrl ===');
console.log(createProductUrl('iPhone 14 Pro Max', 'iPhone', 123)); 
// -> "/san-pham/iphone/iphone-14-pro-max-123"

console.log(createProductUrl('MacBook Air M2', 'MacBook', 456)); 
// -> "/san-pham/macbook/macbook-air-m2-456"

console.log(createProductUrl('Samsung Galaxy S23', 'Điện thoại', 789)); 
// -> "/san-pham/dien-thoai/samsung-galaxy-s23-789"

// Test extractIdFromSlug
console.log('\n=== Test extractIdFromSlug ===');
console.log(extractIdFromSlug('iphone-14-pro-max-123')); // -> 123
console.log(extractIdFromSlug('macbook-air-m2-456')); // -> 456
console.log(extractIdFromSlug('samsung-galaxy-s23-789')); // -> 789

// Test createCategoryUrl
console.log('\n=== Test createCategoryUrl ===');
console.log(createCategoryUrl('iPhone')); // -> "/san-pham/iphone"
console.log(createCategoryUrl('MacBook')); // -> "/san-pham/macbook"
console.log(createCategoryUrl('Điện thoại')); // -> "/san-pham/dien-thoai"
