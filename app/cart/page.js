"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState([]);

  const loadCart = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem("societyCart") || "[]");
      setItems(savedItems);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setItems([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart:update", handleCartUpdate);

    return () => window.removeEventListener("cart:update", handleCartUpdate);
  }, []);

  const updateQty = (product, delta) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      const updatedCart = storedCart
        .map((item) => {
          const sameItem = (item._id && item._id === product._id) || item.title === product.title;
          if (!sameItem) return item;

          const nextQty = Math.max(1, (item.qty || 1) + delta);
          return { ...item, qty: nextQty };
        })
        .filter((item) => (item.qty || 1) > 0);

      localStorage.setItem("societyCart", JSON.stringify(updatedCart));
      setItems(updatedCart);
      window.dispatchEvent(new Event("cart:update"));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeItem = (product) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
      const updatedCart = storedCart.filter(
        (item) => !((item._id && item._id === product._id) || item.title === product.title)
      );

      localStorage.setItem("societyCart", JSON.stringify(updatedCart));
      setItems(updatedCart);
      window.dispatchEvent(new Event("cart:update"));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const subtotal = Math.round(items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0));
  const delivery = items.length > 0 ? 40 : 0;
  const total = subtotal + delivery;

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_35%,#172554_100%)] p-6 text-slate-100">
      <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96),rgba(30,41,59,0.96))] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Your cart</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Review your selected items.</h1>
          <p className="mt-4 text-slate-200">Manage your cart here before heading to checkout.</p>

          <div className="mt-8 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-6 text-slate-300">
                Your cart is empty. Add a few essentials from the home page to get started.
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id || item.title} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                      <p className="text-sm text-slate-300">Qty: {item.qty || 1}</p>
                      <p className="text-sm text-slate-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-blue-100">₹{Math.round(Number(item.price || 0) * Number(item.qty || 1))}</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item, -1)}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                        >
                          −
                        </button>
                        <span className="min-w-8 rounded-full bg-white/8 px-3 py-1 text-center text-sm font-semibold text-white">{item.qty || 1}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item, 1)}
                          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        className="mt-2 rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="rounded-[28px] border border-white/10 bg-slate-950/95 p-8 shadow-[0_24px_60px_rgba(2,6,23,0.75)] backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white">Cart summary</h2>
          <div className="mt-6 rounded-2xl border border-blue-400/30 bg-blue-400/10 p-4 text-sm text-blue-50">
            <div className="flex items-center justify-between"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
            <div className="mt-2 flex items-center justify-between"><span>Delivery</span><strong>₹{delivery}</strong></div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-base font-bold text-white"><span>Total</span><strong>₹{total}</strong></div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.02]"
          >
            Proceed to checkout
          </Link>
          <Link href="/" className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:bg-white/10">Continue shopping</Link>
        </aside>
      </section>
    </main>
  );
}
