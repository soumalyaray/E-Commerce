"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialItems = [
  { item: "Fresh grocery pack", qty: "2 items", price: 420 },
  { item: "Household essentials", qty: "1 bundle", price: 260 },
  { item: "Society convenience order", qty: "3 items", price: 540 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  const loadCart = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem("societyCart") || "[]");

      if (savedItems.length > 0) {
        setItems(savedItems.map((item) => ({
          item: item.title || item.item,
          qty: `${item.qty || 1} item${(item.qty || 1) > 1 ? "s" : ""}`,
          price: Number(item.price || 0) * Number(item.qty || 1),
          original: item,
        })));
      } else {
        setItems([]);
      }
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

  const subtotal = Math.round(items.reduce((sum, item) => sum + Number(item.price || 0), 0));
  const delivery = items.length > 0 ? 40 : 0;
  const total = Math.round(subtotal + delivery);

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      setShowEmptyWarning(true);
      return;
    }

    setShowEmptyWarning(false);
    localStorage.removeItem("societyCart");
    window.dispatchEvent(new Event("cart:update"));
    router.push("/thank-you");
  };

  const removeItem = (itemName) => {
    const savedItems = JSON.parse(localStorage.getItem("societyCart") || "[]");
    const updatedItems = savedItems.filter((item) => (item.title || item.item) !== itemName);

    localStorage.setItem("societyCart", JSON.stringify(updatedItems));
    setItems(
      updatedItems.length > 0
        ? updatedItems.map((item) => ({
            item: item.title || item.item,
            qty: `${item.qty || 1} item${(item.qty || 1) > 1 ? "s" : ""}`,
            price: Number(item.price || 0) * Number(item.qty || 1),
            original: item,
          }))
        : []
    );
    window.dispatchEvent(new Event("cart:update"));
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_35%,#172554_100%)] text-slate-100">
      {showEmptyWarning && items.length === 0 ? (
        <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-50 shadow-xl shadow-amber-950/30 backdrop-blur-md">
            <p className="font-semibold">Add items to proceed</p>
            <p className="mt-1 text-amber-100">Your cart is empty right now. Add some products from the home page to place an order.</p>
          </div>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-12">
        <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96),rgba(30,41,59,0.96))] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">Checkout</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Complete your order from the Kolkata society marketplace.</h1>
          <p className="mt-4 max-w-xl text-slate-200">Secure, simple, and built for quick delivery coordination within your society.</p>

          <div className="mt-8 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-6 text-slate-300">
                No items selected. Everything has been removed from your checkout.
              </div>
            ) : (
              items.map((entry) => (
                <div key={entry.item} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30 transition hover:border-cyan-400/60 hover:bg-slate-900">
                  <div>
                    <h2 className="font-semibold text-white">{entry.item}</h2>
                    <p className="text-sm text-slate-300">{entry.qty}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-100">₹{Math.round(Number(entry.price || 0))}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(entry.item)}
                      className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="rounded-[28px] border border-white/10 bg-slate-950/95 p-8 shadow-[0_24px_60px_rgba(2,6,23,0.75)] backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white">Billing details</h2>
          <form className="mt-6 space-y-4">
            <label className="block text-sm text-slate-200">Name
              <input className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none ring-0 transition focus:border-blue-400" placeholder="Asha Das" />
            </label>
            <label className="block text-sm text-slate-200">Society / Flat
              <input className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Lake View Society, Flat 4B" />
            </label>
            <label className="block text-sm text-slate-200">Phone
              <input className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="+91 98765 43210" />
            </label>
            <label className="block text-sm text-slate-200">Delivery note
              <textarea className="mt-1 min-h-22 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400" placeholder="Leave at the gate or call before delivery." />
            </label>

            <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-4 text-sm text-blue-50">
              <div className="flex items-center justify-between"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div className="mt-2 flex items-center justify-between"><span>Delivery</span><strong>₹{delivery}</strong></div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-base font-bold text-white"><span>Total</span><strong>₹{total}</strong></div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full rounded-2xl bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.02] hover:shadow-cyan-500/20"
            >
              Place order
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
