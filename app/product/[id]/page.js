"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const productId = params?.id;

  const getImageUrl = (image) => {
    if (!image) return "";
    const separator = image.includes("?") ? "&" : "?";
    return `${image}${separator}random=${Math.floor(Math.random() * 1000000)}`;
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch("/api/seed/products");
        const data = await res.json();

        const match = (Array.isArray(data) ? data : []).find((item) => {
          const id = String(item._id || item.id || "");
          const title = String(item.title || "");
          return id === productId || decodeURIComponent(productId || "") === title;
        });

        setProduct(match || null);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();

    try {
      const savedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      setCartItems(savedCart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, [productId]);

  const addToCart = () => {
    if (!product) return;

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
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeFromCart = () => {
    if (!product) return;

    try {
      const storedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      const updatedCart = storedCart.filter(
        (item) => !((item._id && item._id === product._id) || item.title === product.title)
      );

      localStorage.setItem("societyCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event("cart:update"));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const inCart = useMemo(
    () => cartItems.some((item) => (item._id && item._id === product?._id) || item.title === product?.title),
    [cartItems, product]
  );

  if (loading) {
    return <main className="min-h-screen bg-slate-950 p-8 text-white">Loading product…</main>;
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-xl shadow-slate-950/40">
          <h1 className="text-3xl font-black">Product not found</h1>
          <p className="mt-3 text-slate-300">This product could not be located in the marketplace catalog.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-blue-500 px-5 py-3 font-semibold text-white">Back to products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_35%,#172554_100%)] p-6 text-slate-100">
      <section className="mx-auto grid max-w-6xl gap-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96),rgba(30,41,59,0.96))] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr] md:p-10">
        <div className="rounded-3xl border border-white/10 bg-white p-4 shadow-xl shadow-slate-950/30">
          {product.image ? (
            <img src={getImageUrl(product.image)} alt={product.title} className="h-80 w-full rounded-2xl object-contain" />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">No image</div>
          )}
        </div>

        <article className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Product details</p>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{product.title}</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-blue-200">{product.category}</p>
            <p className="mt-5 text-lg text-slate-200">{product.description}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">Price</p>
                <p className="text-3xl font-black text-white">₹{(Number(product.price || 0) * 99).toFixed(2)}</p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-100">Society pickup</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {inCart ? (
                <button
                  type="button"
                  onClick={removeFromCart}
                  className="rounded-full border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                >
                  Remove from cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={addToCart}
                  className="rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.02]"
                >
                  Add to cart
                </button>
              )}

              <Link href="/cart" className="rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">View cart</Link>
              <Link href="/checkout" className="rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-400/20">Go to checkout</Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
