import Link from "next/link";

const trustPoints = [
  { title: "Free shipping", body: "On every order, no minimum" },
  { title: "Secure payment", body: "UPI, cards and wallets via Razorpay" },
  { title: "7-day returns", body: "Easy exchange if it isn't right" },
];

export default function Footer() {
  return (
    <footer className="bg-indigo-dark text-cotton mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10">
        {trustPoints.map((t) => (
          <div key={t.title}>
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-cotton/70 mt-1">{t.body}</p>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-display text-xl mb-3">Sirya</p>
          <p className="text-cotton/70">Home textiles woven for everyday comfort.</p>
        </div>
        <div>
          <p className="eyebrow text-cotton/60 mb-3">Shop</p>
          <ul className="space-y-2 text-cotton/80">
            <li><Link href="/category/bedsheets">Bedsheets</Link></li>
            <li><Link href="/category/comforters">Comforters</Link></li>
            <li><Link href="/category/blankets">Blankets</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-cotton/60 mb-3">Support</p>
          <ul className="space-y-2 text-cotton/80">
            <li><Link href="/pages/contact">Contact</Link></li>
            <li><Link href="/pages/shipping">Shipping policy</Link></li>
            <li><Link href="/pages/returns">Returns</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-cotton/60 mb-3">Stay in touch</p>
          <p className="text-cotton/70 mb-3">Weekly notes on new arrivals.</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded bg-cotton/10 border border-cotton/20 px-3 py-2 text-sm placeholder:text-cotton/50"
          />
        </div>
      </div>
      <p className="text-center text-xs text-cotton/50 pb-6">© 2026 Sirya. All rights reserved.</p>
    </footer>
  );
}
