import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { categories, products } from './data/products.js';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function ProductCard({ product, onOpen, onAdd, isSaved, onToggleSave }) {
  return (
    <article className="product-card">
      <button className="product-photo" type="button" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </button>
      <button
        className={`save-button${isSaved ? ' is-saved' : ''}`}
        type="button"
        onClick={() => onToggleSave(product.id)}
        aria-label={isSaved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
        aria-pressed={isSaved}
      >
        <Heart size={17} fill={isSaved ? 'currentColor' : 'none'} />
      </button>
      <div className="product-info">
        <button className="product-name" type="button" onClick={() => onOpen(product)}>{product.name}</button>
        <span className="product-price">{currency.format(product.price)}</span>
        <div className="product-bottom">
          <span>{product.color}</span>
          <button className="add-button" type="button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}>
            <Plus size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All pieces');
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('common-goods-cart') || '[]');
    } catch {
      return [];
    }
  });
  const [saved, setSaved] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('common-goods-saved') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const [savedOnly, setSavedOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('common-goods-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('common-goods-saved', JSON.stringify(saved));
  }, [saved]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = activeCategory === 'All pieces' || product.category === activeCategory;
      const searchMatch = !query || `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query);
      const savedMatch = !savedOnly || saved.includes(product.id);
      return categoryMatch && searchMatch && savedMatch;
    });
    if (sortBy === 'price-low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [activeCategory, saved, savedOnly, search, sortBy]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  }

  function changeQuantity(productId, amount) {
    setCart((current) => current
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  }

  function toggleSaved(productId) {
    setSaved((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }

  function finishOrder(event) {
    event.preventDefault();
    setCart([]);
    setCheckoutOpen(false);
    setOrderPlaced(true);
  }

  return (
    <>
      <div className="announcement"><Sparkles size={14} /> A little something extra: free shipping over $100 <span className="announcement-arrow">→</span></div>
      <header className="site-header">
        <button className="icon-button mobile-menu-button" type="button" aria-label="Open menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <a className="wordmark" href="#top" aria-label="Common Goods home">common<span>goods</span><i>.</i></a>
        <nav className={`main-nav${mobileMenuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
          <a href="#shop" onClick={() => setMobileMenuOpen(false)}>Shop all</a>
          <a href="#shop" onClick={() => { setActiveCategory('Objects'); setMobileMenuOpen(false); }}>Objects</a>
          <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our little story</a>
        </nav>
        <div className="header-actions">
          {searchOpen && <input className="search-input" autoFocus placeholder="Find your something..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" />}
          <button className="icon-button" type="button" aria-label={searchOpen ? 'Close search' : 'Search'} onClick={() => { setSearchOpen(!searchOpen); setSearch(''); }}>
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <button className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cartCount} items`}>
            <ShoppingBag size={19} /><span className="bag-label">Bag</span><span className="bag-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-star">✳</span> GOOD THINGS, MADE TO LAST</p>
            <h1 id="hero-title">Make room<br />for <em>everyday</em><br />wonder.</h1>
            <p className="hero-description">Thoughtful little objects for the rituals, routines, and in-between moments that make a life.</p>
            <a className="primary-link" href="#shop">Find your something <ArrowRight size={17} /></a>
            <div className="hero-note"><span className="note-asterisk">✳</span><span>Considered things.<br />Considered carefully.</span></div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90" alt="Sunlit living room with a collected mix of thoughtful home objects" />
            <div className="hero-image-caption"><span>THE SOFTER SIDE OF HOME</span><span>01 / 04</span></div>
            <div className="hero-stamp"><span>GOOD<br />THINGS<br /><i>inside</i></span><span className="stamp-sun">✳</span></div>
          </div>
          <div className="hero-index">01—04</div>
        </section>

        <section className="shop-section" id="shop">
          <div className="shop-heading">
            <div><p className="eyebrow">THE GOOD STUFF</p><h2>Little things, <em>big feeling.</em></h2></div>
            <p className="shop-intro">Made with care. Chosen to keep.<br />Here for the everyday and the in-between.</p>
          </div>
          <div className="shop-toolbar">
            <div className="category-list" role="group" aria-label="Filter by category">
              {categories.map((category) => (
                <button key={category} type="button" className={`category-button${activeCategory === category ? ' active' : ''}`} onClick={() => setActiveCategory(category)}>{category}</button>
              ))}
            </div>
            <button className={`saved-filter${savedOnly ? ' active' : ''}`} type="button" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}>
              <Heart size={14} fill={savedOnly ? 'currentColor' : 'none'} /><span>Saved</span><span className="saved-count">{saved.length}</span>
            </button>
            <label className="sort-control"><ArrowDownUp size={14} /><span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
              </select><ChevronDown size={14} className="sort-chevron" />
            </label>
          </div>
          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} onAdd={addToCart} isSaved={saved.includes(product.id)} onToggleSave={toggleSaved} />)}
            </div>
          ) : (
            <div className="empty-results"><span>✳</span><p>{savedOnly ? 'Nothing saved just yet.' : 'No little things found.'}</p><button type="button" onClick={() => { setSearch(''); setActiveCategory('All pieces'); setSavedOnly(false); }}>See all pieces</button></div>
          )}
          <div className="shop-footer"><span>Showing {visibleProducts.length} thoughtful things</span><a href="#story">A little more about us <ArrowRight size={15} /></a></div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=85" alt="A calm, collected home interior with natural textures" loading="lazy" /></div>
          <div className="story-copy"><p className="eyebrow"><span className="eyebrow-star">✳</span> LESS, BUT LOVELIER</p><h2>Good things<br />feel like <em>home.</em></h2><p>We believe the things we live with should earn their place. So we look for thoughtful design, honest materials, and makers who care about the details.</p><a className="text-link" href="#shop">Get to know us <ArrowRight size={16} /></a><span className="story-doodle">✳</span></div>
        </section>

        <section className="newsletter">
          <div><p className="eyebrow">A LETTER FROM US</p><h2>Good things, <em>occasionally.</em></h2></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setNewsletterSubmitted(true); event.currentTarget.reset(); }}>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={19} /></button>
            <span role="status">{newsletterSubmitted ? 'You’re on the list. Talk soon!' : 'Notes from our world. No noise, ever.'}</span>
          </form>
        </section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top">common<span>goods</span><i>.</i></a><span>Thoughtful things for everyday life.</span><span>© 2026 Common Goods Co.</span><a href="#top">Back to top ↑</a></footer>

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" aria-label="Shopping bag">
          <div className="drawer-heading"><div><p className="eyebrow">YOUR GOOD THINGS</p><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}><X size={21} /></button></div>
          {cart.length ? <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} /><div className="cart-item-copy"><h3>{item.name}</h3><span>{item.color}</span><div className="quantity-control"><button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={13} /></button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={13} /></button></div></div><strong>{currency.format(item.price * item.quantity)}</strong>
            </div>)}</div>
            <div className="cart-bottom"><div className="shipping-note">{subtotal >= 100 ? <><Check size={15} /> You’ve unlocked free shipping!</> : <>You’re {currency.format(100 - subtotal)} away from free shipping</>}</div><div className="subtotal-line"><span>Subtotal</span><strong>{currency.format(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="checkout-button" type="button" onClick={() => setCheckoutOpen(true)}>Continue to checkout <ArrowRight size={17} /></button><button className="continue-button" type="button" onClick={() => setCartOpen(false)}>Keep looking around</button></div>
          </> : <div className="empty-bag"><span className="empty-bag-icon"><ShoppingBag size={29} /></span><h3>Your bag feels a little light.</h3><p>Let’s find something you’ll love living with.</p><button className="checkout-button" type="button" onClick={() => setCartOpen(false)}>Explore the collection <ArrowRight size={17} /></button></div>}
        </aside>
      </div>}

      {selectedProduct && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
        <section className="product-modal" aria-label={`${selectedProduct.name} details`}>
          <button className="icon-button modal-close" type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)}><X size={21} /></button>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <div className="modal-product-copy"><p className="eyebrow">{selectedProduct.category.toUpperCase()} / MADE WITH CARE</p><h2>{selectedProduct.name}</h2><span className="modal-price">{currency.format(selectedProduct.price)}</span><p>{selectedProduct.description}</p><span className="modal-color">Color: {selectedProduct.color}</span><button className="checkout-button" type="button" onClick={() => addToCart(selectedProduct)}>Add to bag <Plus size={17} /></button><span className="modal-shipping">A little extra: free shipping on orders over $100</span></div>
        </section>
      </div>}

      {checkoutOpen && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
        <section className="checkout-modal" aria-label="Checkout">
          <button className="icon-button modal-close" type="button" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}><X size={21} /></button>
          <p className="eyebrow">ALMOST YOURS</p><h2>Let’s make it <em>official.</em></h2><p className="checkout-summary">{cartCount} {cartCount === 1 ? 'good thing' : 'good things'} · {currency.format(subtotal)}</p>
          <form onSubmit={finishOrder} className="checkout-form"><label>Email address<input type="email" placeholder="you@example.com" autoComplete="email" required /></label><label>Full name<input type="text" placeholder="Your name" autoComplete="name" required /></label><label>Shipping address<input type="text" placeholder="Street and number" autoComplete="street-address" required /></label><div className="checkout-row"><label>City<input type="text" placeholder="City" autoComplete="address-level2" required /></label><label>ZIP code<input type="text" placeholder="00000" autoComplete="postal-code" required /></label></div><button className="checkout-button" type="submit">Place demo order · {currency.format(subtotal)} <ArrowRight size={17} /></button><p className="demo-disclaimer">Demo checkout · No payment will be taken.</p></form>
        </section>
      </div>}

      {orderPlaced && <div className="overlay modal-overlay"><section className="success-modal"><span className="success-icon"><Check size={28} /></span><p className="eyebrow">THAT’S A WRAP</p><h2>Good things are <em>coming.</em></h2><p>Your demo order is in. Thanks for giving these little things a home.</p><button className="checkout-button" type="button" onClick={() => setOrderPlaced(false)}>Back to the good stuff <ArrowRight size={17} /></button></section></div>}
    </>
  );
}

export default App;
