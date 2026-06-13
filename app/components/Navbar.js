"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem("societyCart") || "[]");
        const totalItems = savedCart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error("Failed to read cart count:", error);
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cart:update", updateCartCount);

    return () => window.removeEventListener("cart:update", updateCartCount);
  }, []);

  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-extrabold tracking-wide text-blue-100">
          Kolkata Society Market
        </Link>

        <div className="flex items-center gap-3 text-sm md:gap-6 md:text-base">
          <Link href="/" className="text-slate-200 transition hover:text-blue-300">Home</Link>
          <Link href="/about" className="text-slate-200 transition hover:text-blue-300">About</Link>
          <Link href="/cart" className="inline-flex items-center gap-2 text-slate-200 transition hover:text-blue-300">
            <span>Cart</span>
            <span className="rounded-full bg-blue-500/90 px-2.5 py-0.5 text-xs font-bold text-white shadow-lg shadow-blue-900/30">{cartCount}</span>
          </Link>
          <Link href="/checkout" className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-400">Checkout</Link>
        </div>
      </div>
    </nav>
  );
}
