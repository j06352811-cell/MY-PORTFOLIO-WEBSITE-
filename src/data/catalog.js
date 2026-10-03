export function getVisibleProducts(items, options = {}) {
  const {
    category = 'All pieces',
    search = '',
    savedIds = [],
    savedOnly = false,
    sortBy = 'featured',
  } = options;
  const query = search.trim().toLowerCase();

  const filtered = items.filter((product) => {
    const categoryMatch = category === 'All pieces' || product.category === category;
    const searchMatch = !query || `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query);
    const savedMatch = !savedOnly || savedIds.includes(product.id);
    return categoryMatch && searchMatch && savedMatch;
  });

  if (sortBy === 'price-low') return [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}
