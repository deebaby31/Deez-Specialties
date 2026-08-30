import { useState, useRef, useEffect } from "react";
import Templates from "./Templates";
import { fetchProducts, createCheckout, type ShopifyProduct } from "./lib/shopify";

const CATEGORIES = [
  { id: "Streetwear", label: "Streetwear", color: "#FF1478" },
  { id: "Electronics", label: "Electronics", color: "#00F5FF" },
  { id: "Beauty", label: "Beauty", color: "#BF00FF" },
  { id: "Home", label: "Home & Lifestyle", color: "#FF6B00" },
];

const PRODUCTS = [
  // ── Streetwear ──
  {
    id: 1, name: "Air Grind Low", category: "Streetwear", price: 119, originalPrice: 159, badge: "HOT DROP",
    img: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&h=700&fit=crop&auto=format",
    alt: "White teal sneaker against graffiti wall",
  },
  {
    id: 2, name: "Street Kix Vol. 2", category: "Streetwear", price: 94, originalPrice: null, badge: "NEW",
    img: "https://images.unsplash.com/photo-1619466122087-e1ff06cf234b?w=600&h=700&fit=crop&auto=format",
    alt: "Black and yellow sneakers",
  },
  {
    id: 3, name: "Ghost Hoodie", category: "Streetwear", price: 74, originalPrice: 98, badge: "SALE",
    img: "https://images.unsplash.com/photo-1606964212916-4d23bf4044cb?w=600&h=700&fit=crop&auto=format",
    alt: "Streetwear hoodie jacket",
  },
  {
    id: 4, name: "Void Slip-On", category: "Streetwear", price: 55, originalPrice: null, badge: null,
    img: "https://images.unsplash.com/photo-1716347685367-1eb5de72eb65?w=600&h=700&fit=crop&auto=format",
    alt: "Sneakers on wall",
  },
  // ── Electronics ──
  {
    id: 5, name: "ProBuds Wireless", category: "Electronics", price: 39, originalPrice: 59, badge: "BEST SELLER",
    img: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=700&fit=crop&auto=format",
    alt: "Wireless earbuds",
  },
  {
    id: 6, name: "Studio Cans BT", category: "Electronics", price: 64, originalPrice: null, badge: "NEW",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=700&fit=crop&auto=format",
    alt: "Bluetooth headphones",
  },
  {
    id: 7, name: "PocketCharge Pro", category: "Electronics", price: 28, originalPrice: 42, badge: "SALE",
    img: "https://images.unsplash.com/photo-1566554738544-d962991c3fee?w=600&h=700&fit=crop&auto=format",
    alt: "Power bank charger",
  },
  // ── Beauty ──
  {
    id: 8, name: "Glow Kit Essentials", category: "Beauty", price: 34, originalPrice: 52, badge: "HOT DROP",
    img: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=600&h=700&fit=crop&auto=format",
    alt: "Skincare and makeup products",
  },
  {
    id: 9, name: "Cloud Serum SPF 50", category: "Beauty", price: 22, originalPrice: null, badge: "NEW",
    img: "https://images.unsplash.com/photo-1600428853876-fb5a850b444f?w=600&h=700&fit=crop&auto=format",
    alt: "Skincare serum bottle",
  },
  {
    id: 10, name: "Hydra Boost Set", category: "Beauty", price: 29, originalPrice: 44, badge: "SALE",
    img: "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&h=700&fit=crop&auto=format",
    alt: "Skincare bottle set",
  },
  // ── Home ──
  {
    id: 11, name: "Glow Arc Lamp", category: "Home", price: 47, originalPrice: 68, badge: "BEST SELLER",
    img: "https://images.unsplash.com/photo-1769255119650-f658d3dbc397?w=600&h=700&fit=crop&auto=format",
    alt: "Modern arc lamp",
  },
  {
    id: 12, name: "Neon Sign Kit", category: "Home", price: 35, originalPrice: null, badge: "NEW",
    img: "https://images.unsplash.com/photo-1558273246-57d22047406d?w=600&h=700&fit=crop&auto=format",
    alt: "Colorful neon signs",
  },
  {
    id: 13, name: "Wave LED Strip", category: "Home", price: 19, originalPrice: 32, badge: "SALE",
    img: "https://images.unsplash.com/photo-1581300740943-cfa5f847db2c?w=600&h=700&fit=crop&auto=format",
    alt: "Purple LED neon light",
  },
];

const TESTIMONIALS = [
  { name: "Darius K.", handle: "@dariusk_nyc", text: "Bro the hoodie is INSANE quality. Wore it to the park and got like 6 compliments. Deez Specialties go crazy fr.", rating: 5, color: "#BF00FF" },
  { name: "Aaliyah M.", handle: "@aaliyah.fits", text: "Ordered the Air Grind Lows and they came in 2 days. Box was clean, shoes are clean, whole vibe is clean. 10/10.", rating: 5, color: "#FF1478" },
  { name: "Trev Blaze", handle: "@trevblaze", text: "Limited deck dropped and I copped in 3 mins. No cap this site is different. The deck art is absolute fire.", rating: 5, color: "#00F5FF" },
];

const BADGES = [
  { symbol: "⚡", label: "Free Shipping", sub: "Orders over $60", color: "#FFE600" },
  { symbol: "✺", label: "30-Day Returns", sub: "No cap, no hassle", color: "#FF1478" },
  { symbol: "⬡", label: "Legit Secured", sub: "SSL encrypted checkout", color: "#BF00FF" },
  { symbol: "◉", label: "Real Support", sub: "Real heads, fast reply", color: "#00F5FF" },
];

const NEONS = ["#FFE600", "#FF1478", "#00F5FF", "#BF00FF", "#FF6B00", "#C800FF"];

function Stars({ n }: { n: number }) {
  return <span className="font-marker" style={{ color: "#FFE600", letterSpacing: 2, fontSize: 14 }}>{"★".repeat(n)}</span>;
}

function ProductCard({ p, idx, onSelect }: { p: typeof PRODUCTS[0]; idx: number; onSelect?: (p: typeof PRODUCTS[0]) => void }) {
  const [hov, setHov] = useState(false);
  const neon = NEONS[idx % NEONS.length];
  return (
    <div className="cursor-pointer" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onSelect?.(p)}
      style={{ transition: "transform 0.2s", transform: hov ? "scale(1.02)" : "scale(1)" }}>
      <div className="relative overflow-hidden mb-4" style={{
        background: "#111",
        border: `2px solid ${hov ? neon : "rgba(255,255,255,0.08)"}`,
        boxShadow: hov ? `0 0 24px ${neon}55` : "none",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}>
        <img src={p.img} alt={p.alt} className="w-full object-cover transition-transform duration-500"
          style={{ height: 300, transform: hov ? "scale(1.06)" : "scale(1)" }} />
        {hov && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: neon, boxShadow: `0 0 10px ${neon}` }} />}
        {p.badge && (
          <span className="font-bebas absolute top-3 left-3 px-3 py-1 text-sm tracking-widest" style={{
            background: p.badge === "SALE" ? "#FF1478" : p.badge === "HOT DROP" ? "#FFE600" : "#0a0a0a",
            color: p.badge === "HOT DROP" ? "#0a0a0a" : "#f5f5f0",
            border: p.badge === "HOT DROP" || p.badge === "SALE" ? "none" : `1px solid ${neon}`,
          }}>{p.badge}</span>
        )}
        <button className="font-bebas absolute bottom-0 left-0 right-0 py-3 text-base tracking-widest transition-all duration-200"
          style={{ background: neon, color: "#0a0a0a", opacity: hov ? 1 : 0, transform: hov ? "translateY(0)" : "translateY(100%)" }}>
          ADD TO CART
        </button>
      </div>
      <p className="font-body text-xs tracking-widest uppercase mb-1" style={{ color: neon, opacity: 0.85 }}>{p.category}</p>
      <p className="font-bebas text-xl tracking-wider mb-1" style={{ color: "#f5f5f0" }}>{p.name}</p>
      <div className="flex items-center gap-2">
        <span className="font-body font-bold text-sm" style={{ color: "#f5f5f0" }}>${p.price}</span>
        {p.originalPrice && <>
          <span className="font-body text-sm line-through" style={{ color: "#555" }}>${p.originalPrice}</span>
          <span className="font-body text-xs font-bold" style={{ color: "#FF1478" }}>-{Math.round((1 - p.price / p.originalPrice) * 100)}%</span>
        </>}
      </div>
    </div>
  );
}

// ── Shop Dropdown ─────────────────────────────────────────────────────────────
function ShopDropdown({ onSelect, categories }: { onSelect: (cat: string) => void; categories?: { id: string; label: string; color: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cats = categories && categories.length > 0 ? categories : CATEGORIES;

  return (
    <div ref={ref} className="relative">
      <button
        className="font-bebas text-lg tracking-widest transition-colors duration-200 hover:text-yellow-300 flex items-center gap-1"
        style={{ color: open ? "#FFE600" : "#888", letterSpacing: "0.14em", background: "none", border: "none", cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        SHOP {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 py-2 min-w-[200px]"
          style={{ background: "#111", border: "2px solid rgba(255,230,0,0.2)", boxShadow: "0 0 30px rgba(255,230,0,0.15)" }}>
          <button
            className="font-bebas w-full text-left px-5 py-3 tracking-widest text-base transition-colors hover:bg-white/5"
            style={{ color: "#FFE600", letterSpacing: "0.14em", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => { onSelect("All"); setOpen(false); }}
          >
            ALL PRODUCTS
          </button>
          {cats.map(cat => (
            <button key={cat.id}
              className="font-bebas w-full text-left px-5 py-3 tracking-widest text-base transition-all hover:bg-white/5 flex items-center gap-3"
              style={{ color: cat.color, letterSpacing: "0.14em", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => { onSelect(cat.id); setOpen(false); }}
            >
              <span style={{ fontSize: 8, background: cat.color, borderRadius: "50%", width: 8, height: 8, display: "inline-block", flexShrink: 0 }} />
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Product Detail Page ───────────────────────────────────────────────────────
function ProductDetailPage({ product, onBack }: { product: typeof PRODUCTS[0]; onBack: () => void }) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const neon = NEONS[product.id % NEONS.length];
  const cat = CATEGORIES.find(c => c.id === product.category);

  const sizes = product.category === "Streetwear"
    ? ["6", "7", "8", "9", "10", "11", "12"]
    : product.category === "Beauty"
    ? ["30ml", "50ml", "100ml"]
    : [];

  async function handleAddToCart() {
    const variantId = (product as any).variantId;
    if (variantId) {
      setLoading(true);
      const url = await createCheckout(variantId, qty);
      setLoading(false);
      if (url) { window.open(url, "_blank"); return; }
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="py-16 px-6 md:px-12" style={{ minHeight: "80vh" }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack}
          className="font-bebas text-sm tracking-widest mb-10 flex items-center gap-2 transition-colors hover:text-white"
          style={{ color: "#555", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.14em" }}>
          ← BACK
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative" style={{ border: `2px solid ${neon}44`, boxShadow: `0 0 40px ${neon}22` }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: neon, boxShadow: `0 0 10px ${neon}` }} />
            <img src={product.img.replace("w=600&h=700", "w=800&h=900")} alt={product.alt}
              className="w-full object-cover" style={{ height: 500 }} />
            {product.badge && (
              <span className="font-bebas absolute top-4 left-4 px-3 py-1 text-sm tracking-widest"
                style={{
                  background: product.badge === "SALE" ? "#FF1478" : product.badge === "HOT DROP" ? "#FFE600" : "#0a0a0a",
                  color: product.badge === "HOT DROP" ? "#0a0a0a" : "#f5f5f0",
                  border: product.badge === "HOT DROP" || product.badge === "SALE" ? "none" : `1px solid ${neon}`,
                }}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="font-marker text-xs mb-2" style={{ color: cat?.color ?? neon, transform: "rotate(-1deg)", display: "inline-block" }}>
              {product.category}
            </p>
            <h1 className="font-rubik leading-none mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
              {product.name.toUpperCase()}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-bebas text-3xl" style={{ color: "#f5f5f0" }}>${product.price}</span>
              {product.originalPrice && <>
                <span className="font-body text-lg line-through" style={{ color: "#555" }}>${product.originalPrice}</span>
                <span className="font-bebas px-2 py-0.5 text-sm" style={{ background: "#FF1478", color: "#fff" }}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>}
            </div>

            <p className="font-body text-sm leading-relaxed mb-8" style={{ color: "#888", fontWeight: 300 }}>
              Premium quality, limited stock. Part of the DEEZ Specialties curated collection — sourced for quality, priced for the people. Ships worldwide in 2–7 days.
            </p>

            {/* Size picker */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p className="font-bebas text-sm tracking-widest mb-3" style={{ color: "#888", letterSpacing: "0.14em" }}>
                  {product.category === "Streetwear" ? "SIZE (US)" : "SIZE"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className="font-bebas px-4 py-2 text-sm tracking-wider transition-all"
                      style={{
                        border: `2px solid ${size === s ? neon : "rgba(255,255,255,0.15)"}`,
                        color: size === s ? "#0a0a0a" : "#888",
                        background: size === s ? neon : "transparent",
                        boxShadow: size === s ? `0 0 12px ${neon}66` : "none",
                        cursor: "pointer",
                        letterSpacing: "0.1em",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-bebas text-sm tracking-widest mb-3" style={{ color: "#888", letterSpacing: "0.14em" }}>QTY</p>
              <div className="flex items-center gap-0" style={{ border: "2px solid rgba(255,255,255,0.15)", display: "inline-flex" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="font-bebas px-4 py-2 text-lg transition-colors hover:bg-white/10"
                  style={{ color: "#f5f5f0", background: "none", border: "none", cursor: "pointer" }}>−</button>
                <span className="font-bebas px-5 py-2 text-lg" style={{ color: "#f5f5f0", borderLeft: "2px solid rgba(255,255,255,0.15)", borderRight: "2px solid rgba(255,255,255,0.15)" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="font-bebas px-4 py-2 text-lg transition-colors hover:bg-white/10"
                  style={{ color: "#f5f5f0", background: "none", border: "none", cursor: "pointer" }}>+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart}
              className="font-bebas py-4 text-xl tracking-widest transition-all duration-200 hover:scale-[1.02] mb-4"
              style={{
                background: added ? "#00F5FF" : "#FFE600",
                color: "#0a0a0a",
                letterSpacing: "0.18em",
                boxShadow: added ? "0 0 24px rgba(0,245,255,0.5)" : "0 0 24px rgba(255,230,0,0.4)",
                cursor: "pointer",
                border: "none",
              }}>
              {loading ? "LOADING..." : added ? "✓ ADDED TO BAG" : "ADD TO BAG"}
            </button>

            {/* Trust micro-badges */}
            <div className="flex flex-col gap-2">
              {["🚚 Free shipping on orders over $60", "↩ 30-day hassle-free returns", "🔒 Secure checkout"].map(t => (
                <p key={t} className="font-body text-xs" style={{ color: "#555" }}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category Page ─────────────────────────────────────────────────────────────
function CategoryPage({ category, products: allProducts, onBack, onProductSelect }: { category: string; products: typeof PRODUCTS; onBack: () => void; onProductSelect: (p: typeof PRODUCTS[0]) => void }) {
  const cat = CATEGORIES.find(c => c.id === category);
  const color = cat?.color ?? "#FFE600";
  const products = category === "All" ? allProducts : allProducts.filter(p => p.category === category);
  const label = category === "All" ? "ALL PRODUCTS" : cat?.label.toUpperCase() ?? category;

  return (
    <div className="py-16 px-6 md:px-12" style={{ minHeight: "80vh" }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="font-bebas text-sm tracking-widest mb-8 flex items-center gap-2 transition-colors hover:text-white"
          style={{ color: "#555", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.14em" }}>
          ← BACK TO STORE
        </button>
        <p className="font-marker text-sm mb-2" style={{ color, transform: "rotate(-1.5deg)", display: "inline-block" }}>
          {products.length} items
        </p>
        <h1 className="font-rubik leading-none mb-12"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
          {label}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
          {products.map((p, i) => <ProductCard key={p.id} p={p} idx={i} onSelect={onProductSelect} />)}
        </div>
      </div>
    </div>
  );
}

function mapShopifyCategory(p: ShopifyProduct): string {
  const type = p.productType?.toLowerCase() ?? "";
  const tags = p.tags?.map(t => t.toLowerCase()) ?? [];
  if (type.includes("beauty") || type.includes("skin") || tags.some(t => t.includes("beauty") || t.includes("skin"))) return "Beauty";
  if (type.includes("electronic") || type.includes("tech") || tags.some(t => t.includes("tech") || t.includes("electronic"))) return "Electronics";
  if (type.includes("home") || type.includes("decor") || tags.some(t => t.includes("home") || t.includes("decor"))) return "Home";
  return "Streetwear";
}

function mapShopifyProducts(items: ShopifyProduct[]) {
  return items.map((p, i) => ({
    id: i + 100,
    shopifyId: p.id,
    variantId: p.variants.edges[0]?.node.id ?? "",
    name: p.title,
    category: mapShopifyCategory(p),
    price: Math.round(parseFloat(p.priceRange.minVariantPrice.amount)),
    originalPrice: (() => {
      const compare = parseFloat(p.compareAtPriceRange.minVariantPrice.amount);
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      return compare > price ? Math.round(compare) : null;
    })(),
    badge: null as string | null,
    img: p.images.edges[0]?.node.url ?? "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&h=700&fit=crop&auto=format",
    alt: p.images.edges[0]?.node.altText ?? p.title,
    handle: p.handle,
  }));
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [page, setPage] = useState<"store" | "templates" | "category" | "product">("store");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [liveProducts, setLiveProducts] = useState<ReturnType<typeof mapShopifyProducts>>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts().then(items => {
      if (items.length > 0) setLiveProducts(mapShopifyProducts(items));
      setLoadingProducts(false);
    });
  }, []);

  const displayProducts = liveProducts.length > 0 ? liveProducts : PRODUCTS;

  // Derive categories from available products so menus always match data
  const derivedCategories = ((): { id: string; label: string; color: string }[] => {
    const ids = Array.from(new Set(displayProducts.map(p => p.category)));
    const result = [{ id: 'All', label: 'All', color: '#FFE600' } as const].concat(
      ids.map((id, i) => {
        const found = CATEGORIES.find(c => c.id === id || c.label === id);
        return found ?? { id, label: id, color: NEONS[i % NEONS.length] };
      }),
    );
    return result;
  })();

  function handleCategorySelect(cat: string) {
    setActiveCategory(cat);
    setPage("category");
    setMenuOpen(false);
  }

  function handleProductSelect(product: typeof PRODUCTS[0]) {
    setSelectedProduct(product);
    setPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f5f5f0" }}>

      {/* Announcement bar */}
      <div className="font-bebas text-center py-2.5 tracking-widest text-sm"
        style={{ background: "#FFE600", color: "#0a0a0a", letterSpacing: "0.2em" }}>
        ⚡ FREE WORLDWIDE SHIPPING ON ORDERS $60+ — LIMITED DROPS EVERY FRIDAY ⚡
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "rgba(10,10,10,0.93)", borderBottom: "2px solid rgba(255,230,0,0.2)", backdropFilter: "blur(16px)" }}>

        <a href="#" onClick={() => setPage("store")} className="flex flex-col leading-none" style={{ textDecoration: "none" }}>
          <span className="font-rubik flicker"
            style={{ fontSize: 22, color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
            DEEZ
          </span>
          <span className="font-marker text-xs" style={{ color: "#00F5FF", marginTop: -4, fontSize: 10, letterSpacing: 2 }}>
            SPECIALTIES
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <ShopDropdown onSelect={handleCategorySelect} categories={derivedCategories} />
          <button onClick={() => setPage("templates")}
            className="font-bebas text-lg tracking-widest transition-colors hover:text-yellow-300"
            style={{ color: page === "templates" ? "#FFE600" : "#888", letterSpacing: "0.14em", background: "none", border: "none", cursor: "pointer" }}>
            TEMPLATES
          </button>
          {["COLLABS", "ABOUT", "CONTACT"].map(link => (
            <button key={link} className="font-bebas text-lg tracking-widest transition-colors hover:text-yellow-300"
              style={{ color: "#888", letterSpacing: "0.14em", background: "none", border: "none", cursor: "pointer" }}>
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative font-bebas text-lg tracking-wider transition-colors hover:text-white"
            style={{ color: "#f5f5f0" }} aria-label="Cart">
            BAG
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 w-4 h-4 flex items-center justify-center text-xs font-bold font-body"
                style={{ background: "#FF1478", color: "#fff", borderRadius: "50%", fontSize: 10 }}>
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#FFE600", background: "none", border: "none", cursor: "pointer" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col pt-24 px-8 gap-2" style={{ background: "#0a0a0a" }}>
          <p className="font-bebas text-sm tracking-widest mb-2" style={{ color: "#555", letterSpacing: "0.16em" }}>SHOP BY CATEGORY</p>
          {derivedCategories.filter(c => c.id !== 'All').map((cat) => (
            <button key={cat.id} onClick={() => { handleCategorySelect(cat.id); setMenuOpen(false); }}
              className="font-rubik text-3xl text-left transition-colors"
              style={{ color: cat.color, background: "none", border: "none", cursor: "pointer" }}>
              {cat.label}
            </button>
          ))}
          <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {["Templates", "Collabs", "About", "Contact"].map((link, i) => (
              <button key={link} onClick={() => { if (link === "Templates") setPage("templates"); setMenuOpen(false); }}
                className="font-bebas text-xl block mb-3"
                style={{ color: "#888", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.14em" }}>
                {link.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pages */}
      {page === "templates" && <Templates />}
      {page === "product" && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setPage(activeCategory ? "category" : "store")}
        />
      )}
      {page === "category" && (
        <CategoryPage
          category={activeCategory}
          products={displayProducts}
          onBack={() => setPage("store")}
          onProductSelect={handleProductSelect}
        />
      )}

      {page === "store" && <>
        {/* HERO */}
        <section className="relative overflow-hidden" style={{ minHeight: "94vh" }}>
          <img src="https://images.unsplash.com/photo-1611063158871-7dd3ed4a2ac8?w=1600&h=1000&fit=crop&auto=format"
            alt="Graffiti wall" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.28 }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(10,10,10,0.97) 35%, rgba(10,10,10,0.5) 100%)" }} />
          <div className="absolute top-0 right-24 w-1 opacity-60" style={{ height: 140, background: "linear-gradient(to bottom, #FFE600, transparent)" }} />
          <div className="absolute top-0 right-36 w-0.5 opacity-50" style={{ height: 80, background: "linear-gradient(to bottom, #FF1478, transparent)" }} />
          <div className="absolute top-0 right-16 w-0.5 opacity-50" style={{ height: 110, background: "linear-gradient(to bottom, #00F5FF, transparent)" }} />
          <div className="absolute top-0 right-44 w-1 opacity-60" style={{ height: 160, background: "linear-gradient(to bottom, #BF00FF, transparent)" }} />
          <div className="absolute top-0 right-52 w-0.5 opacity-40" style={{ height: 90, background: "linear-gradient(to bottom, #FF69B4, transparent)" }} />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-center" style={{ minHeight: "94vh" }}>
            <div className="max-w-3xl">
              <div className="font-marker inline-block mb-6 px-4 py-1"
                style={{ color: "#FF1478", fontSize: 14, transform: "rotate(-2deg)", border: "2px solid #FF1478", boxShadow: "0 0 12px rgba(255,20,120,0.4)", display: "inline-block" }}>
                ✦ New Drop — Aug 2026
              </div>
              <h1 className="font-rubik leading-none mb-6"
                style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)", letterSpacing: "-0.01em" }}>
                DEEZ
              </h1>
              <h2 className="font-marker mb-8 leading-tight"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f5f5f0", transform: "rotate(-1deg)", display: "inline-block" }}>
                Specialties.{" "}
                <span style={{ color: "#00F5FF", textShadow: "0 0 20px rgba(0,245,255,0.5)" }}>Only the Best.</span>
              </h2>
              <p className="font-body text-base md:text-lg mb-10 leading-relaxed"
                style={{ color: "#888", maxWidth: 480, fontWeight: 300 }}>
                Street-certified gear, limited collabs, and kicks you won't find at the mall. We ship worldwide. No fakes. No fluff.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleCategorySelect("All")}
                  className="font-bebas px-10 py-4 text-xl tracking-widest transition-all duration-200 hover:scale-105"
                  style={{ background: "#FFE600", color: "#0a0a0a", boxShadow: "0 0 24px rgba(255,230,0,0.4)", letterSpacing: "0.18em" }}>
                  SHOP THE DROP
                </button>
                <button className="font-bebas px-10 py-4 text-xl tracking-widest transition-all duration-200 hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.2)", color: "#f5f5f0", letterSpacing: "0.18em", background: "none", cursor: "pointer" }}>
                  VIEW LOOKBOOK
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section style={{ borderTop: "2px solid rgba(255,230,0,0.15)", borderBottom: "2px solid rgba(255,230,0,0.15)" }} className="py-8 px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {BADGES.map(b => (
              <div key={b.label} className="flex items-start gap-3">
                <span style={{ color: b.color, fontSize: 20 }}>{b.symbol}</span>
                <div>
                  <p className="font-bebas text-base tracking-wider" style={{ color: "#f5f5f0", letterSpacing: "0.1em" }}>{b.label}</p>
                  <p className="font-body text-xs" style={{ color: "#666" }}>{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Cards */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <p className="font-marker text-sm mb-2" style={{ color: "#FF1478", transform: "rotate(-1deg)", display: "inline-block" }}>
              shop by category
            </p>
            <h2 className="font-rubik leading-none mb-12"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
              WHAT YOU NEED
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => {
                const preview = displayProducts.find(p => p.category === cat.id);
                return (
                  <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                    className="relative overflow-hidden text-left group"
                    style={{ height: 280, background: "#111", border: `2px solid ${cat.color}33`, cursor: "pointer", padding: 0 }}>
                    {preview && (
                      <img src={preview.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ opacity: 0.45 }} />
                    )}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(10,10,10,0.95) 30%, rgba(10,10,10,0.3) 100%)` }} />
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="font-marker text-xs mb-1" style={{ color: cat.color, fontSize: 10 }}>
                        {displayProducts.filter(p => p.category === cat.id).length} items
                      </p>
                      <p className="font-rubik" style={{ fontSize: 28, color: "#f5f5f0", lineHeight: 1 }}>{cat.label.toUpperCase()}</p>
                      <p className="font-bebas text-xs tracking-widest mt-2" style={{ color: cat.color, letterSpacing: "0.14em" }}>
                        SHOP NOW →
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sale banner */}
        <section className="relative overflow-hidden mx-6 md:mx-12 mb-20">
          <img src="https://images.unsplash.com/photo-1651675804338-8a1cbfb5bd54?w=1400&h=480&fit=crop&auto=format"
            alt="Graffiti tunnel" className="w-full object-cover" style={{ height: 360, opacity: 0.4 }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{ background: "rgba(10,10,10,0.65)" }}>
            <p className="font-marker mb-4" style={{ color: "#00F5FF", fontSize: 14, transform: "rotate(-1.5deg)" }}>This weekend only</p>
            <h2 className="font-rubik mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
              UP TO 40% OFF
            </h2>
            <button onClick={() => handleCategorySelect("All")}
              className="font-bebas px-10 py-4 text-xl tracking-widest transition-all duration-200 hover:scale-105"
              style={{ border: "2px solid #FFE600", color: "#FFE600", letterSpacing: "0.18em", boxShadow: "0 0 20px rgba(255,230,0,0.3)", background: "none", cursor: "pointer" }}>
              GRAB THE DEALS
            </button>
          </div>
          <div className="absolute top-4 left-4 font-marker text-xs" style={{ color: "#FF1478", transform: "rotate(-8deg)" }}>SALE!</div>
          <div className="absolute bottom-4 right-4 font-marker text-xs" style={{ color: "#00F5FF", transform: "rotate(5deg)" }}>limited</div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 md:px-12" style={{ borderTop: "2px solid rgba(255,230,0,0.1)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-marker mb-3 inline-block" style={{ color: "#FF1478", fontSize: 14, transform: "rotate(-1deg)" }}>the people said it</p>
              <h2 className="font-rubik"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
                REAL TALK
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="p-7 relative" style={{ background: "#111", border: `2px solid ${t.color}33` }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: t.color, opacity: 0.7, boxShadow: `0 0 8px ${t.color}` }} />
                  <Stars n={t.rating} />
                  <p className="font-body mt-4 mb-6 leading-relaxed text-sm" style={{ color: "#aaa", fontWeight: 300 }}>"{t.text}"</p>
                  <p className="font-bebas tracking-wider" style={{ color: "#f5f5f0", letterSpacing: "0.1em" }}>{t.name}</p>
                  <p className="font-body text-xs" style={{ color: "#555" }}>{t.handle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-6 md:px-12" style={{ background: "#0f0f0f", borderTop: "2px solid rgba(255,230,0,0.12)" }}>
          <div className="max-w-lg mx-auto text-center">
            <p className="font-marker mb-4 inline-block" style={{ color: "#00F5FF", fontSize: 14, transform: "rotate(-1.5deg)" }}>don't sleep on it</p>
            <h2 className="font-rubik mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>
              GET 10% OFF
            </h2>
            <p className="font-body text-sm mb-8 leading-relaxed" style={{ color: "#666" }}>
              Drop your email. Get 10% off your first order + early access to limited releases. No spam, ever.
            </p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 text-sm outline-none font-body"
                style={{ background: "#1a1a1a", border: "2px solid rgba(255,230,0,0.2)", color: "#f5f5f0" }} />
              <button type="submit" className="font-bebas px-6 py-3 text-base tracking-widest transition-all hover:scale-105"
                style={{ background: "#FFE600", color: "#0a0a0a", letterSpacing: "0.14em", boxShadow: "0 0 16px rgba(255,230,0,0.35)" }}>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 pt-16 pb-10" style={{ borderTop: "2px solid rgba(255,230,0,0.12)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
              <div className="col-span-2 md:col-span-1">
                <div className="font-rubik mb-1" style={{ fontSize: 28, color: "#FFE600", textShadow: "0 0 20px rgba(255,230,0,0.8), 0 0 60px rgba(255,20,120,0.4)" }}>DEEZ</div>
                <div className="font-marker text-xs mb-4" style={{ color: "#00F5FF", letterSpacing: 2, marginTop: -4 }}>SPECIALTIES</div>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#555", fontWeight: 300, maxWidth: 200 }}>
                  Street-certified. World-shipped. No fakes ever.
                </p>
              </div>
              {[
                { title: "SHOP", links: ["All Products", "Streetwear", "Electronics", "Beauty", "Home"] },
                { title: "HELP", links: ["FAQ", "Shipping", "Returns", "Track Order"] },
                { title: "DEEZ", links: ["About", "Collabs", "Press", "Contact"] },
              ].map(col => (
                <div key={col.title}>
                  <p className="font-bebas text-sm tracking-widest mb-4" style={{ color: "#FFE600", letterSpacing: "0.16em" }}>{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="font-body text-sm transition-colors hover:text-white" style={{ color: "#555" }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="font-body text-xs" style={{ color: "#444" }}>© 2026 Deez Specialties. All rights reserved.</p>
              <div className="flex items-center gap-5">
                {[
                  { label: "IG", color: "#FF1478", href: "https://instagram.com" },
                  { label: "TK", color: "#00F5FF", href: "https://tiktok.com" },
                  { label: "TW", color: "#BF00FF", href: "https://twitter.com" },
                  { label: "YT", color: "#FFE600", href: "https://youtube.com" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="font-bebas text-sm tracking-widest transition-colors hover:text-white"
                    style={{ color: s.color, letterSpacing: "0.1em" }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </>}
    </div>
  );
}
