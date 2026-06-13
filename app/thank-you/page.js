import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_35%,#172554_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <article className="w-full rounded-[28px] border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96),rgba(30,41,59,0.96))] p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl md:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Order notification</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Thank you for shopping with us! 🛍️✨</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Your order has been placed successfully. A confirmation message is on its way, and your cart has been cleared for the next visit.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.02]"
            >
              Continue shopping
            </Link>
            <Link
              href="/checkout"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Back to checkout
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
