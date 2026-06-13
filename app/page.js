"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const getImageUrl = (image) => {
    if (!image) return "";
    const separator = image.includes("?") ? "&" : "?";
    return `${image}${separator}random=${Math.floor(Math.random() * 1000000)}`;
  };

  useEffect(() => {
    fetch("/api/seed/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));

    try {
      const savedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      setCartItems(savedCart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);
  const addToCart = (product) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      const existingItem = storedCart.find(
        (item) => (item._id && item._id === product._id) || item.title === product.title
      );

      if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
      } else {
        storedCart.push({
          ...product,
          qty: 1,
          price: Number(product.price || 0) * 99,
        });
      }

      localStorage.setItem("societyCart", JSON.stringify(storedCart));
      setCartItems(storedCart);
      window.dispatchEvent(new Event("cart:update"));
    } catch (error) {
      console.error("Failed to save cart item:", error);
    }
  };

  const removeFromCart = (product) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      const updatedCart = storedCart.filter(
        (item) => !((item._id && item._id === product._id) || item.title === product.title)
      );

      localStorage.setItem("societyCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event("cart:update"));
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const isInCart = (product) =>
    cartItems.some((item) => (item._id && item._id === product._id) || item.title === product.title);

  const handleSearch = async () => {
    const searchTerm = query.trim();

    if (!searchTerm) {
      setProducts([]);
      return;
    }

    const res = await fetch("/api/seed/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchTerm }),
    });

    if (!res.ok) {
      console.error("Search request failed", await res.text());
      return;
    }

    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_38%,#172554_100%)] p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96),rgba(17,24,39,0.98))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Kolkata society marketplace</p>
              <h1 className="mt-3 text-4xl font-black text-white md:text-5xl lg:text-6xl">Stylish, easy, and trusted shopping for your society.</h1>
              <p className="mt-4 text-lg text-slate-200 md:text-xl">Discover everyday essentials, curated picks, and community-first convenience from a premium Kolkata marketplace.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50 shadow-lg shadow-emerald-950/30">
              Free delivery for society orders above ₹999
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/40 backdrop-blur-xl md:flex-row md:items-center">
          <input
            value={query}
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search products..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 md:flex-1"
          />
          <button
            onClick={handleSearch}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.02] hover:shadow-cyan-500/20"
          >
            Search
          </button>
        </div>
        {products.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-300">No products found. Try a broader keyword for your society shopping list.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p._id || p.id || p.title}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-400/60 hover:shadow-[0_24px_55px_rgba(56,189,248,0.18)]"
              >
                <div className="flex h-48 items-center justify-center bg-[linear-gradient(135deg,#eff6ff,#e0f2fe)] p-4">
                  {p.image ? (
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.title}
                      className="object-contain h-48 w-full"
                    />
                  ) : (
                    <div className="text-gray-400">No image</div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 transition hover:text-blue-600">{p.title}</h2>
                  <p className="mt-1 text-sm uppercase tracking-[0.25em] text-blue-700">{p.category}</p>

                  <p className="mt-3 flex-1 text-sm text-slate-600">{p.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-xl font-black text-slate-900">₹{(Number(p.price || 0) * 99).toFixed(2)}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {isInCart(p) ? (
                      <button
                        type="button"
                        onClick={() => removeFromCart(p)}
                        className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-400/20"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(p)}
                        className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
