"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Registration could not be completed. Please try again.",
        );
        return;
      }

      setSuccess(true);
      const target =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("callbackUrl")
          : null;
      setTimeout(() => {
        router.push(
          target
            ? `/login?callbackUrl=${encodeURIComponent(target)}`
            : "/login",
        );
      }, 1500);
    } catch (err) {
      setError("Registration could not be completed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-sacred-50/50">
      <div className="w-full max-w-md space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-saffron-700 flex items-center justify-center text-white shadow">
              <Sparkles className="w-5 h-5 text-gold-300" />
            </div>
            <span className="font-serif text-2xl font-bold text-sacred-950">
              Rudra<span className="text-saffron-700">Kart</span>
            </span>
          </Link>
          <h2 className="font-serif text-xl font-bold text-sacred-900 pt-2">
            Create Customer Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Join RudraKart for verified certificate tracking and secure
            ordering.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-sacred-900">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-sacred-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="aarav@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-sacred-900">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                minLength={12}
                maxLength={128}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-sacred-900">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+977 98XXXXXXXX"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-sacred-900">
              Delivery Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="City, District, Nepal"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-xs"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full gap-2 shadow mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-saffron-700 hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
