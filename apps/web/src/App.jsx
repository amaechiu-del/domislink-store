import { useEffect, useMemo, useState } from 'react'
import './App.css'

const products = [
  {
    id: 'studio-kit',
    name: 'The Studio Starter Kit',
    creator: 'by Sunday Supply',
    category: 'Templates',
    price: 24,
    rating: '4.9',
    badge: 'Bestseller',
    artwork: 'studio',
    mark: 'SS',
    artworkTitle: 'Make room for good ideas',
    format: 'Notion template',
  },
  {
    id: 'slow-mornings',
    name: 'Slow Mornings, Vol. 01',
    creator: 'by Alina Moore',
    category: 'E-books',
    price: 16,
    rating: '4.8',
    badge: 'New',
    artwork: 'mornings',
    mark: '01',
    artworkTitle: 'A softer start to your day',
    format: 'Digital guide · 48 pages',
  },
  {
    id: 'film-tones',
    name: 'Everyday Film Tones',
    creator: 'by Mono Studio',
    category: 'Presets',
    price: 18,
    rating: '5.0',
    badge: '',
    artwork: 'film',
    mark: 'M.',
    artworkTitle: 'Colour, with a little feeling',
    format: '12 Lightroom presets',
  },
  {
    id: 'soft-focus',
    name: 'Soft Focus',
    creator: 'by Clara James',
    category: 'Audio',
    price: 12,
    rating: '4.9',
    badge: '',
    artwork: 'audio',
    mark: '♫',
    artworkTitle: 'A little space to breathe',
    format: 'Ambient audio · 35 min',
  },
  {
    id: 'weekend-pages',
    name: 'Weekend Pages',
    creator: 'by Paperfolk',
    category: 'Templates',
    price: 9,
    rating: '4.7',
    badge: 'Popular',
    artwork: 'pages',
    mark: 'weekend',
    artworkTitle: 'A home for all your lists',
    format: 'Printable planner · 18 pages',
  },
  {
    id: 'creative-reset',
    name: 'The Creative Reset',
    creator: 'by Field Notes Club',
    category: 'E-books',
    price: 14,
    rating: '4.9',
    badge: '',
    artwork: 'reset',
    mark: 'FIELD NOTES',
    artworkTitle: 'Make space for what’s next',
    format: 'Workbook · 32 pages',
  },
  {
    id: 'sunlit-grain',
    name: 'Sunlit Grain',
    creator: 'by Elodie Gray',
    category: 'Presets',
    price: 22,
    rating: '4.8',
    badge: '',
    artwork: 'sunlit',
    mark: 'EG',
    artworkTitle: 'Summer, saved in colour',
    format: '8 Lightroom presets',
  },
  {
    id: 'little-rituals',
    name: 'Little Rituals',
    creator: 'by June & Co.',
    category: 'Audio',
    price: 8,
    rating: '4.9',
    badge: '',
    artwork: 'rituals',
    mark: 'JUNE',
    artworkTitle: 'A playlist for the in-between',
    format: 'Curated playlist · 42 min',
  },
]

const categories = ['Everything', 'Templates', 'E-books', 'Presets', 'Audio']
const formatPrice = (price) => `$${price.toFixed(2)}`

function getSavedCart() {
  try {
    const saved = JSON.parse(window.localStorage.getItem('domislink-cart') || '[]')
    return Array.isArray(saved)
      ? saved.filter((item) => products.some((product) => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
      : []
  } catch {
    return []
  }
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Everything')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState(getSavedCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem('domislink-cart', JSON.stringify(cart))
    } catch {
      setNotice('Your browser could not save the cart on this device.')
    }
  }, [cart])

  useEffect(() => {
    if (!cartOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [cartOpen])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === 'Everything' || product.category === activeCategory
      const matchesSearch = !query || `${product.name} ${product.creator} ${product.category}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
    if (sort === 'price-low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [activeCategory, search, sort])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((product) => product.id === item.id)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { id: product.id, quantity: 1 }]
    })
    setNotice(`${product.name} added to your cart.`)
    window.setTimeout(() => setNotice(''), 2500)
  }

  function updateQuantity(productId, change) {
    setCart((current) => current
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0))
  }

  function renderProduct(product) {
    return (
      <article className="product-card" key={product.id}>
        <div className={`product-art art-${product.artwork}`}>
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <span className="art-mark">{product.mark}</span>
          <span className="art-title">{product.artworkTitle}</span>
          <span className="art-format">{product.format}</span>
        </div>
        <div className="product-info">
          <div className="product-copy">
            <span className="product-category">{product.category}</span>
            <h3>{product.name}</h3>
            <p>{product.creator}</p>
          </div>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-actions">
          <span className="product-rating"><span aria-hidden="true">★</span> {product.rating}</span>
          <button className="add-button" type="button" onClick={() => addToCart(product)}>
            Add to cart <span aria-hidden="true">+</span>
          </button>
        </div>
      </article>
    )
  }

  return (
    <div className="store">
      <div className="announcement">
        <span>Little things, made with love.</span>
        <span>Instant downloads on every order <span aria-hidden="true">↗</span></span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Domislink home">
          <span className="brand-symbol" aria-hidden="true">d</span>
          domislink<span className="wordmark-period">.</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-current" href="#shop">Shop</a>
          <a href="#shop" onClick={() => setActiveCategory('Templates')}>Templates</a>
          <a href="#shop" onClick={() => setActiveCategory('E-books')}>E-books</a>
          <a href="#about">Our little story</a>
        </nav>
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}>
          <span className="cart-icon" aria-hidden="true">⌑</span>
          <span>Bag</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> A LITTLE BIT OF INSPIRATION</span>
            <h1>Good things,<br />made for <em>you.</em></h1>
            <p>Thoughtful digital finds from independent creators. Here to make your everyday a little more lovely.</p>
            <a href="#shop" className="hero-link">Find your next favourite <span aria-hidden="true">↘</span></a>
            <div className="hero-note"><span aria-hidden="true">✳</span> A small shop with a big heart</div>
          </div>
          <div className="hero-art" aria-label="A curated selection of digital products">
            <div className="hero-sun" />
            <div className="hero-leaf leaf-one" />
            <div className="hero-leaf leaf-two" />
            <div className="hero-card hero-card-back">
              <span>THE GOOD<br />THINGS CLUB</span><i>✳</i>
            </div>
            <div className="hero-card hero-card-front">
              <span className="hero-card-kicker">A LITTLE NOTE TO SELF</span>
              <span className="hero-card-message">Make space<br />for wonder.</span>
              <span className="hero-card-flower">✿</span>
            </div>
            <div className="hero-sticker"><span>made<br />with care</span><b>✳</b></div>
            <span className="hero-caption">the Sunday edit · vol. 04</span>
          </div>
          <div className="hero-pagination" aria-hidden="true"><span className="pagination-active" /> <span /> <span /></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow section-eyebrow">THE GOOD STUFF</span>
              <h2>A little something for <em>every day.</em></h2>
              <p>Made by good people, for the way you live and work.</p>
            </div>
            <div className="shop-controls">
              <label className="search-box">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <span className="visually-hidden">Search products</span>
                <input type="search" placeholder="Find something lovely..." value={search} onChange={(event) => setSearch(event.target.value)} />
              </label>
              <label className="sort-box">
                <span className="visually-hidden">Sort products</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          <div className="shop-body">
            <aside className="category-list" aria-label="Filter by category">
              <span className="filter-label">BROWSE BY</span>
              {categories.map((category) => (
                <button
                  className={activeCategory === category ? 'category-button category-active' : 'category-button'}
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                >
                  <span>{category}</span>
                  {category === 'Everything' && <span className="category-total">08</span>}
                </button>
              ))}
              <div className="sidebar-note">
                <span aria-hidden="true">♡</span>
                <p>Every purchase supports an independent creator.</p>
              </div>
            </aside>

            <div className="product-area">
              <div className="results-line">
                <span>{search ? `Showing ${visibleProducts.length} lovely ${visibleProducts.length === 1 ? 'find' : 'finds'}` : 'A few things we think you’ll love'}</span>
                <span>{String(visibleProducts.length).padStart(2, '0')} FINDS</span>
              </div>
              {visibleProducts.length > 0
                ? <div className="product-grid">{visibleProducts.map(renderProduct)}</div>
                : <div className="empty-results"><span aria-hidden="true">✳</span><h3>Nothing here just yet.</h3><p>Try another search or browse everything lovely.</p><button type="button" onClick={() => { setSearch(''); setActiveCategory('Everything') }}>Show me everything</button></div>}
            </div>
          </div>
        </section>

        <section className="creator-banner" id="about">
          <span className="creator-flower" aria-hidden="true">✳</span>
          <div><span className="eyebrow">A NOTE FROM US</span><h2>Good things grow <em>together.</em></h2><p>We’re here to champion the makers who put a little extra heart into what they do.</p></div>
          <a href="#shop">Meet your makers <span aria-hidden="true">↗</span></a>
        </section>

        <section className="newsletter">
          <span className="eyebrow">LETTERS FROM THE GOOD SIDE</span>
          <h2>A little lovely in your inbox.</h2>
          <p>New finds, creator stories, and notes to make your week. No noise, ever.</p>
          <form onSubmit={(event) => { event.preventDefault(); setNotice('Thanks for stopping by! Newsletter sign-up is coming soon.'); window.setTimeout(() => setNotice(''), 3500) }}>
            <label className="visually-hidden" htmlFor="newsletter-email">Your email address</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" required />
            <button type="submit">Count me in <span aria-hidden="true">→</span></button>
          </form>
          <span className="newsletter-footnote">The occasional good thing. Unsubscribe whenever.</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top"><span className="brand-symbol" aria-hidden="true">d</span>domislink<span className="wordmark-period">.</span></a>
        <span>© 2025 Domislink. Made for the little things.</span>
        <a href="#top">Back to the top ↑</a>
      </footer>

      {notice && <div className="notice" role="status">{notice}</div>}

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
          <section className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="cart-heading">
              <div><span className="eyebrow">YOUR LITTLE FINDS</span><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div>
              <button type="button" className="close-cart" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty"><span aria-hidden="true">✳</span><h3>Your bag is taking a little nap.</h3><p>There are lovely things waiting to be found.</p><button type="button" onClick={() => setCartOpen(false)}>Explore the shop</button></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => {
                    const product = products.find((product) => product.id === item.id)
                    if (!product) return null
                    return (
                      <div className="cart-item" key={item.id}>
                        <div className={`cart-thumb art-${product.artwork}`}><span>{product.mark}</span></div>
                        <div className="cart-item-copy"><h3>{product.name}</h3><p>{product.category} · Instant download</p><div className="quantity-control"><button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Remove one ${product.name}`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Add one ${product.name}`}>+</button></div></div>
                        <span className="cart-item-price">{formatPrice(product.price * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Instant digital delivery · No shipping, just good things.</p><button type="button" className="checkout-button" onClick={() => { setNotice('Checkout is not connected yet. Your cart is saved on this device.'); window.setTimeout(() => setNotice(''), 3500) }}>Continue to checkout <span aria-hidden="true">→</span></button></div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App
