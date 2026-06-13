import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#020617_0%,#111827_35%,#172554_100%)] text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96),rgba(30,41,59,0.96))] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl md:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Why this marketplace exists</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">A refined marketplace for every Kolkata society.</h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-200 md:text-xl">
            This platform brings together local essentials, trusted shopping, and simple convenience for Kolkata housing societies. It is designed to feel premium, easy to browse, and genuinely useful every day.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Local-first", "Everything is tailored for society residents, from daily needs to convenience shopping and household essentials."],
            ["Simple checkout", "A clean ordering flow makes it easy to review and buy items without confusion."],
            ["Community support", "The marketplace brings society members closer through a shared digital shopping experience."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-[24px] border border-white/10 bg-white/8 p-6 shadow-xl shadow-slate-950/40 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-white/10">
              <h2 className="text-xl font-bold text-blue-100">{title}</h2>
              <p className="mt-3 text-slate-200">{text}</p>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-xl shadow-emerald-950/30">
          <h2 className="text-2xl font-bold text-emerald-100">Ready to shop?</h2>
          <p className="mt-2 text-slate-100">Browse the store or head to checkout to place your order.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-blue-100">Go to marketplace</Link>
            <Link href="/checkout" className="rounded-full border border-emerald-200/60 px-4 py-2 font-semibold text-emerald-50 hover:bg-emerald-400/10">View checkout</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
