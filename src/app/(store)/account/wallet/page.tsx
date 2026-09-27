"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Send,
  Wallet,
  Copy,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useWalletStore, WalletTransaction } from "@/lib/wallet-store";

function txLabel(tx: WalletTransaction): string {
  if (tx.type === "ADD_FUNDS") return "Wallet Top-Up";
  if (tx.type === "P2P_SENT") return `P2P Sent to ${tx.counterparty || "Wallet"}`;
  if (tx.type === "P2P_RECEIVED") return `P2P Received from ${tx.counterparty || "Wallet"}`;
  return "Checkout Payment";
}

export default function WalletPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("1000");
  const [topUpNote, setTopUpNote] = useState("Wallet recharge");
  const [recipientWallet, setRecipientWallet] = useState("RKW-548210");
  const [transferAmount, setTransferAmount] = useState("500");
  const [transferNote, setTransferNote] = useState("Gift blessing beads fund");
  const [statusMessage, setStatusMessage] = useState("");

  const { currency, usdRate } = useCartStore();
  const {
    walletId,
    balance,
    transactions,
    addFunds,
    sendP2P,
    mockReceiveP2P,
  } = useWalletStore();

  useEffect(() => {
    setMounted(true);
    fetch("/api/account/profile")
      .then((res) => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const recentTransactions = useMemo(() => transactions.slice(0, 8), [transactions]);

  if (!mounted || isAuthenticated === null) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-sacred-200 bg-white p-8 text-sm text-muted-foreground animate-pulse">
          Verifying RudraKart Wallet security access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-saffron-100 text-saffron-800 flex items-center justify-center mx-auto">
          <Wallet className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
            Sign In to Access Your Wallet
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your RudraKart wallet balance and transaction logs are securely bound to your customer profile.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-4">
          <Button variant="primary" asChild>
            <Link href="/login?callbackUrl=/account/wallet">
              Sign In to Your Account
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register?callbackUrl=/account/wallet">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addFunds(Number(topUpAmount), topUpNote);
    if (result.success) {
      setStatusMessage("Wallet top-up successful.");
      return;
    }

    setStatusMessage(result.message || "Top-up failed.");
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const result = sendP2P(recipientWallet, Number(transferAmount), transferNote);
    setStatusMessage(result.message);
  };

  const handleDemoReceive = () => {
    const incoming = Math.floor(200 + Math.random() * 500);
    const result = mockReceiveP2P("RKW-DEMO-PEER", incoming, "Received from RudraKart Circle");
    setStatusMessage(result.success ? `Received ${formatPrice(incoming, currency, usdRate)}.` : "Receive simulation failed.");
  };

  const copyWalletId = async () => {
    await navigator.clipboard.writeText(walletId);
    setStatusMessage("Wallet ID copied to clipboard.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sacred-200 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sacred-950 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-saffron-700" /> RudraKart Digital Wallet
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Store balance and transfer value instantly within the RudraKart P2P network.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/account">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-sacred-200 bg-gradient-to-br from-sacred-900 to-sacred-700 text-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-sacred-200">Available Balance</span>
              <Sparkles className="w-4 h-4 text-gold-300" />
            </div>
            <div className="font-serif text-4xl font-bold text-gold-200">
              {formatPrice(balance, currency, usdRate)}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <span className="font-mono bg-black/20 px-2.5 py-1 rounded-md">Wallet ID: {walletId}</span>
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={copyWalletId}>
                <Copy className="w-3.5 h-3.5" /> Copy ID
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <form
              onSubmit={handleTopUp}
              className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3"
            >
              <h2 className="font-serif text-lg font-bold text-emerald-900 flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5" /> Add Funds
              </h2>
              <input
                type="number"
                min="1"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm"
                placeholder="Amount"
                required
              />
              <input
                type="text"
                value={topUpNote}
                onChange={(e) => setTopUpNote(e.target.value)}
                className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm"
                placeholder="Top-up note"
              />
              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                Confirm Top-Up
              </Button>
            </form>

            <form
              onSubmit={handleTransfer}
              className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-3"
            >
              <h2 className="font-serif text-lg font-bold text-blue-900 flex items-center gap-2">
                <Send className="w-5 h-5" /> P2P Transfer
              </h2>
              <input
                type="text"
                value={recipientWallet}
                onChange={(e) => setRecipientWallet(e.target.value)}
                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm font-mono"
                placeholder="Recipient Wallet ID"
                required
              />
              <input
                type="number"
                min="1"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm"
                placeholder="Transfer amount"
                required
              />
              <input
                type="text"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm"
                placeholder="Transfer note"
              />
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white">
                Send via RudraKart P2P
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={handleDemoReceive} className="gap-2">
              <ArrowUpCircle className="w-4 h-4 text-emerald-700" /> Simulate Incoming Transfer
            </Button>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {statusMessage || "Ready for wallet operations."}
            </span>
          </div>
        </section>

        <aside className="lg:col-span-5 rounded-2xl border border-sacred-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-sacred-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-sacred-950">Recent Wallet Activity</h3>
            <span className="text-xs text-muted-foreground">{transactions.length} entries</span>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No wallet transactions yet. Start by adding funds or sending P2P.
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((tx) => {
                const isDebit = tx.type === "P2P_SENT" || tx.type === "CHECKOUT_PAYMENT";

                return (
                  <div
                    key={tx.id}
                    className="rounded-lg border border-sacred-200 p-3 bg-sacred-50/70 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sacred-900">{txLabel(tx)}</span>
                      <span className={isDebit ? "font-bold text-red-700" : "font-bold text-emerald-700"}>
                        {isDebit ? "-" : "+"}
                        {formatPrice(tx.amount, currency, usdRate)}
                      </span>
                    </div>
                    <div className="pt-1 flex items-center justify-between gap-2 text-muted-foreground">
                      <span className="font-mono text-[11px] truncate">{tx.id}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        {new Date(tx.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {tx.note && <p className="pt-1 text-sacred-700">{tx.note}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
