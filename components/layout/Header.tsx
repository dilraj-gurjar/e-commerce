"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/category/bedsheets", label: "Bedsheets" },
  { href: "/category/comforters", label: "Comforters" },
  { href: "/category/blankets", label: "Blankets" },
  { href: "/collections/bundles", label: "Bundles" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-line bg-cotton sticky top-0 z-40">
      <div className="bg-indigo text-cotton text-center text-xs py-2 tracking-wide">
        Free shipping on every order &nbsp;•&nbsp; Use code SIRYA10 for 10% off
      </div>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-walnut w-6 h-6 flex flex-col justify-center gap-1"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="block h-0.5 bg-walnut" />
            <span className="block h-0.5 bg-walnut" />
            <span className="block h-0.5 bg-walnut" />
          </button>
          <Link href="/" className="font-display text-2xl text-walnut tracking-tight">
            Sirya
          </Link>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-walnut">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-indigo">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-sm text-walnut">
          <Link href="/search" aria-label="Search">Search</Link>
          <Link href="/account" aria-label="Account" className="hidden sm:inline">Account</Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:inline">Wishlist</Link>
          <Link href="/cart" aria-label="Cart" className="font-medium">Cart</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-line bg-cotton px-6 py-4 flex flex-col gap-4 text-sm font-medium text-walnut">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="hover:text-indigo">
              {link.label}
            </Link>
          ))}
          <div className="border-t border-line pt-4 flex flex-col gap-4">
            <Link href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          </div>
        </nav>
      )}
    </header>
  );
}