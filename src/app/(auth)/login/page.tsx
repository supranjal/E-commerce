"use client";

import { Suspense, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCallback = searchParams.get("callbackUrl");
  const callbackUrl =
    requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//")
      ? requestedCallback
      : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        const session = await getSession();
        if (session?.user && (session.user as any).role === "ADMIN") {
          router.push("/admin");
        } else if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/account");
        }
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-sacred-50/50">
      <div className="w-full max-w-md space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-saffron-700 flex items-center justify-center text-white shadow">
              <Sparkles className="w-5 h-5 text-gold-300" />
            </div>
            <span className="font-serif text-2xl font-bold text-sacred-950">
              Rudra<span className="text-saffron-700">Kart</span>
            </span>
          </Link>
          <h2 className="font-serif text-xl font-bold text-sacred-900 pt-2">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Access your orders, saved addresses, and certificate registry.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-sacred-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sacred-900">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 text-sm"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full gap-2 shadow"
          >
            {loading ? "Signing in..." : "Sign In"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-saffron-700 hover:underline"
          >
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center p-4">
          Loading login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
