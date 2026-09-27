"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import {
  ShieldCheck,
  Search,
  User,
  Menu,
  X,
  Globe,
  Sparkles,
  Award,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "./CartDrawer";
import { Currency } from "@/types";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { currency, setCurrency } = useCartStore();

  useEffect(() => {
    getSession().then((session) => setIsSignedIn(Boolean(session?.user)));
  }, []);

  const handleCurrencyToggle = () => {
    setCurrency(currency === "NPR" ? "USD" : "NPR");
  };

  const navLinks = [
    { label: "All Rudraksha", href: "/products" },
    { label: "1–14 Mukhi", href: "/category/1-14-mukhi-rudraksha" },
    { label: "Rare & Sacred", href: "/category/rare-sacred-rudraksha" },
    { label: "Malas & Bracelets", href: "/category/rudraksha-malas" },
    { label: "Verify Certificate", href: "/certificate-verification", highlight: true },
    { label: "Authenticity & Lab", href: "/authenticity" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sacred-200 shadow-xs">
      {/* Top sacred banner */}
      <div className="bg-sacred-900 text-sacred-100 text-[11px] py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Himalayan Origin Guaranteed • Non-Destructive X-Ray Tested</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCurrencyToggle}
            className="flex items-center gap-1 hover:text-gold-300 transition-colors font-mono font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            Currency: <span className="font-bold text-gold-400">{currency}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-700 to-sacred-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-gold-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-sacred-950">
                Rudra<span className="text-saffron-700">Kart</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase font-semibold text-sacred-600 -mt-1">
                Authentic & Certified
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-saffron-700 ${
                  link.highlight
                    ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 text-gold-900 border border-gold-300/70 font-semibold"
                    : "text-sacred-800"
                }`}
              >
                {link.highlight && <Award className="w-3.5 h-3.5 text-gold-700" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-sacred-800 hover:text-saffron-800 hover:bg-sacred-100 transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            <Link
              href={isSignedIn ? "/account" : "/login"}
              className="p-2 rounded-full text-sacred-800 hover:text-saffron-800 hover:bg-sacred-100 transition-colors"
              aria-label={isSignedIn ? "Open your account" : "Sign in to your account"}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Component */}
            <CartDrawer />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-sacred-800 hover:bg-sacred-100"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-sacred-100 animate-in slide-in-from-top-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(
                    searchQuery
                  )}`;
                }
              }}
              className="relative max-w-xl mx-auto flex items-center"
            >
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Mukhi (e.g. 5 Mukhi, Gauri Shankar, Bracelet)..."
                className="w-full pl-9 pr-24 py-2 text-sm rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-saffron-700 text-white hover:bg-saffron-800 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sacred-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-sacred-900 hover:bg-sacred-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-sacred-100 flex items-center justify-between">
            <button
              onClick={handleCurrencyToggle}
              className="text-sm font-semibold text-sacred-800 flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-saffron-700" />
              Switch Currency ({currency})
            </button>
            <div className="flex items-center gap-3">
              <Link
                href="/account/wallet"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-sacred-800"
              >
                Wallet
              </Link>
              <Link
                href={isSignedIn ? "/account" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-saffron-700"
              >
                {isSignedIn ? "My Account" : "Sign In / Register"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
