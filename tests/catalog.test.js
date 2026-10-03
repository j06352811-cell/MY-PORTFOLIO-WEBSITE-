import assert from 'node:assert/strict';
import test from 'node:test';
import { getVisibleProducts } from '../src/data/catalog.js';
import { products } from '../src/data/products.js';

const productIds = (items) => items.map((product) => product.id);

test('filters products by category', () => {
  assert.deepEqual(productIds(getVisibleProducts(products, { category: 'Objects' })), [1, 5, 6]);
});

test('searches product names, categories, and colors without case sensitivity', () => {
  assert.deepEqual(productIds(getVisibleProducts(products, { search: 'SPECKLED' })), [6]);
});

test('combines the saved-items and category filters', () => {
  assert.deepEqual(productIds(getVisibleProducts(products, {
    category: 'Textiles',
    savedIds: [3, 5],
    savedOnly: true,
  })), [3]);
});

test('sorts matching products by ascending and descending price', () => {
  assert.deepEqual(productIds(getVisibleProducts(products, { sortBy: 'price-low' })).slice(0, 3), [6, 5, 7]);
  assert.deepEqual(productIds(getVisibleProducts(products, { sortBy: 'price-high' })).slice(0, 3), [2, 3, 8]);
});

test('returns no products when no saved item matches', () => {
  assert.deepEqual(getVisibleProducts(products, { savedIds: [], savedOnly: true }), []);
});
