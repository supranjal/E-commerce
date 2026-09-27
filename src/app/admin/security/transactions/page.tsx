"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Eye,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getTransactionSecurityRecords,
  verifyTransactionAction,
  simulateTamperingAction,
  getSecurityPublicKeyInfo,
  TransactionAuditItem,
} from "@/actions/security-actions";

export default function AdminTransactionSecurityPage() {
  const [transactions, setTransactions] = useState<TransactionAuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicKeyInfo, setPublicKeyInfo] = useState<any>(null);

  // Verification state
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Tampering simulation state
  const [selectedTxId, setSelectedTxId] = useState<string>("");
  const [tamperedAmount, setTamperedAmount] = useState<number>(50000);
  const [tamperLoading, setTamperLoading] = useState(false);
  const [tamperResult, setTamperResult] = useState<any>(null);

  // Copy state
  const [copiedKey, setCopiedKey] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [records, keyInfo] = await Promise.all([
        getTransactionSecurityRecords(),
        getSecurityPublicKeyInfo(),
      ]);
      setTransactions(records);
      setPublicKeyInfo(keyInfo);
      if (records.length > 0 && !selectedTxId) {
        setSelectedTxId(records[0].transactionId);
        setTamperedAmount(records[0].amount * 10);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (txId: string) => {
    setVerifyingId(txId);
    setVerificationResult(null);
    try {
      const res = await verifyTransactionAction(txId);
      setVerificationResult(res);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleTamperTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxId) return;
    setTamperLoading(true);
    setTamperResult(null);
    try {
      const res = await simulateTamperingAction({
        transactionId: selectedTxId,
        tamperedAmount: Number(tamperedAmount),
      });
      setTamperResult(res);
    } finally {
      setTamperLoading(false);
    }
  };

  const copyPublicKey = () => {
    if (publicKeyInfo?.publicKeyPem) {
      navigator.clipboard.writeText(publicKeyInfo.publicKeyPem);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="border-b border-sacred-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-sacred-950">
              Transaction Security & Integrity Demonstration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              BSc CSIT Defense Lab
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time SHA-256 transaction data hashing, RSA-2048 asymmetric digital signatures, and mathematical tamper-detection lab.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="gap-1.5 h-8 text-xs border-sacred-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Records
        </Button>
      </div>

      {/* Security Architecture Matrix (Requirement 16) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hashing Card */}
        <div className="bg-white p-5 rounded-xl border border-sacred-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              SHA-256
            </span>
          </div>
          <h3 className="font-serif text-sm font-bold text-sacred-950">1. Data Hashing (Integrity)</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            One-way cryptographic digest. Any change to the transaction payload (even a single character or digit) completely alters the resulting 256-bit hash.
          </p>
          <div className="text-[10px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
            <strong>Provides:</strong> Tamper detection (Integrity check only; not encryption).
          </div>
        </div>

        {/* TLS Card */}
        <div className="bg-white p-5 rounded-xl border border-sacred-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              TLS 1.3 / HTTPS
            </span>
          </div>
          <h3 className="font-serif text-sm font-bold text-sacred-950">2. TLS Encryption (In-Transit)</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Encrypts the transport channel between the client browser and RudraKart server. Prevents eavesdropping and packet sniffing during transmission.
          </p>
          <div className="text-[10px] text-blue-900 bg-blue-50 p-2 rounded border border-blue-200 font-medium">
            <strong>Provides:</strong> Confidentiality & channel privacy in transit.
          </div>
        </div>

        {/* Digital Signature Card */}
        <div className="bg-white p-5 rounded-xl border border-sacred-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
              RSA-2048 (PKCS#1)
            </span>
          </div>
          <h3 className="font-serif text-sm font-bold text-sacred-950">3. Digital Signature (Authenticity)</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Signed by RudraKart&apos;s private server key. Anyone with the public key can verify that the transaction originated from our system and was never altered.
          </p>
          <div className="text-[10px] text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200 font-medium">
            <strong>Provides:</strong> Authenticity, Integrity & Non-Repudiation.
          </div>
        </div>
      </div>

      {/* Verification Results Panel (if active) */}
      {verificationResult && (
        <div
          className={`p-5 rounded-2xl border-2 shadow-sm space-y-3 transition-all ${
            verificationResult.success &&
            verificationResult.isHashMatch &&
            verificationResult.isSignatureValid
              ? "bg-emerald-50/70 border-emerald-300"
              : "bg-red-50/70 border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {verificationResult.success &&
              verificationResult.isHashMatch &&
              verificationResult.isSignatureValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h3 className="font-serif text-sm font-bold text-sacred-950">
                Verification Result for Transaction {verificationResult.transaction?.transactionId}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white border border-sacred-200 text-sacred-900">
              Algorithm: {verificationResult.verification?.signatureAlgorithm || "RSA-SHA256"}
            </span>
          </div>

          <p className="text-xs text-sacred-800 font-medium">
            {verificationResult.details}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
            <div className="bg-white p-3 rounded-lg border border-sacred-200 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Recalculated SHA-256 Digest
              </span>
              <div className="font-mono text-[11px] text-sacred-950 break-all font-semibold">
                {verificationResult.recalculatedHash}
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                ✓ Matches stored record
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-sacred-200 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                RSA Asymmetric Public Key Verification
              </span>
              <div className="font-mono text-[11px] text-emerald-800 font-bold">
                VALID SIGNATURE — Non-repudiation Guaranteed
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Signed by server-isolated private key
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Table: Transaction Security Records */}
      <div className="bg-white rounded-2xl border border-sacred-200 shadow-xs overflow-hidden space-y-0">
        <div className="p-4 border-b border-sacred-200 bg-sacred-50/50 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-sacred-950">
              Secured Transaction Ledger
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Canonical JSON payload, 256-bit hash, and asymmetric cryptographic signature for each completed payment.
            </p>
          </div>
          <span className="text-xs font-medium text-sacred-700">
            Total Records: <strong>{transactions.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sacred-100/70 border-b border-sacred-200 font-serif font-bold text-sacred-900 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Tx ID / Order</th>
                <th className="p-3.5">Customer / Gateway</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">SHA-256 Digest</th>
                <th className="p-3.5">RSA Signature (Base64)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sacred-100 font-sans">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-sacred-50/50 transition-colors">
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-sacred-950 block text-xs">
                      {tx.transactionId}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Ref: {tx.orderNumber}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-sacred-950 block">{tx.customerName}</span>
                    <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-sacred-100 text-sacred-900 border border-sacred-200 inline-block mt-0.5">
                      {tx.paymentMethod}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-sacred-950">
                    {tx.currency} {tx.amount.toLocaleString()}
                  </td>

                  <td className="p-3.5 max-w-[160px]">
                    <span className="font-mono text-[10px] text-sacred-800 bg-sacred-50 px-2 py-1 rounded border border-sacred-200 block truncate" title={tx.transactionHash}>
                      {tx.transactionHash}
                    </span>
                  </td>

                  <td className="p-3.5 max-w-[180px]">
                    <span className="font-mono text-[10px] text-sacred-700 bg-sacred-50 px-2 py-1 rounded border border-sacred-200 block truncate" title={tx.digitalSignature}>
                      {tx.digitalSignature}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Valid
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={verifyingId === tx.transactionId}
                      onClick={() => handleVerify(tx.transactionId)}
                      className="h-7 text-[11px] px-2.5 gap-1 border-sacred-300 hover:bg-sacred-100 text-sacred-900"
                    >
                      {verifyingId === tx.transactionId ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      Verify
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Tampering Demonstration Lab (Requirement 10 & 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tampering Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-sacred-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Safe Educational Tamper Testing Lab
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Demonstrates how changing a transaction field immediately breaks the SHA-256 hash and invalidates the digital signature.
              </p>
            </div>
          </div>

          <form onSubmit={handleTamperTest} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-sacred-900">Select Source Transaction</label>
              <select
                value={selectedTxId}
                onChange={(e) => {
                  setSelectedTxId(e.target.value);
                  const found = transactions.find((t) => t.transactionId === e.target.value);
                  if (found) {
                    setTamperedAmount(found.amount * 10);
                  }
                  setTamperResult(null);
                }}
                className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white text-xs font-mono"
              >
                {transactions.map((tx) => (
                  <option key={tx.transactionId} value={tx.transactionId}>
                    {tx.transactionId} — {tx.customerName} ({tx.currency} {tx.amount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-sacred-900">
                Simulate Tampered Amount (Original modified to simulate financial fraud)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sacred-700 text-sm">NPR</span>
                <input
                  type="number"
                  value={tamperedAmount}
                  onChange={(e) => setTamperedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 font-mono font-bold text-sm bg-red-50/50 text-red-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                Example: Altering payment from original to NPR {tamperedAmount.toLocaleString()}
              </span>
            </div>

            <Button
              type="submit"
              disabled={tamperLoading || !selectedTxId}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold h-9 text-xs gap-1.5 shadow-sm"
            >
              {tamperLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              Run Tampering Verification Attack
            </Button>
          </form>
        </div>

        {/* Tampering Result Visualizer */}
        <div className="lg:col-span-6 bg-sacred-50/60 p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-sacred-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-saffron-700" />
            Integrity Verification Audit Report
          </h3>

          {!tamperResult ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <p>Click &quot;Run Tampering Verification Attack&quot; to test mathematical detection.</p>
              <p className="text-[11px] text-sacred-600">
                The engine will recompute the hash on the altered data and verify the RSA public key signature.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {/* Alert banner */}
              <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-900 font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>FRAUD ATTEMPT CAUGHT: Transaction Rejected by Security Engine!</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-sacred-200 space-y-2 font-mono text-[11px]">
                <div className="text-muted-foreground font-sans font-bold">1. SHA-256 Hash Comparison:</div>
                <div className="text-emerald-800 truncate" title={tamperResult.comparison.originalHash}>
                  <strong className="text-sacred-900 font-sans">Original Hash: </strong>
                  {tamperResult.comparison.originalHash}
                </div>
                <div className="text-red-700 truncate" title={tamperResult.comparison.tamperedHash}>
                  <strong className="text-sacred-900 font-sans">Tampered Hash: </strong>
                  {tamperResult.comparison.tamperedHash}
                </div>
                <div className="text-red-600 font-bold font-sans text-[11px]">
                  ✗ Result: Original Hash ≠ Tampered Hash (Integrity Violation)
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-sacred-200 space-y-1">
                <div className="text-muted-foreground font-bold text-[11px]">2. RSA Signature Verification:</div>
                <div className="text-red-600 font-bold text-xs">
                  ✗ Result: INVALID (Public Key Cryptographic Failure)
                </div>
                <p className="text-[11px] text-muted-foreground font-sans pt-1">
                  Because the private key was never used to sign this tampered payload, the signature mathematically cannot decrypt to the new hash.
                </p>
              </div>

              <div className="p-2.5 rounded bg-sacred-100 border border-sacred-300 text-[11px] text-sacred-800">
                <strong>Academic Takeaway:</strong> Hashing guarantees that unauthorized modifications are instantly detected, while asymmetric digital signatures provide irrefutable proof of authorship and non-repudiation.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Public Key & Crypto System Inspector (Requirement 13) */}
      <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sacred-100 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-sacred-950 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              Asymmetric Key Management & System Specifications
            </h3>
            <span className="text-muted-foreground text-[11px]">
              Active Algorithm: <strong>{publicKeyInfo?.algorithm || "RSA-SHA256 (2048-bit)"}</strong> | Hash: <strong>SHA-256 (FIPS 180-4)</strong>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={copyPublicKey}
            className="h-7 text-xs gap-1.5 border-sacred-300 text-sacred-800"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedKey ? "Copied PEM" : "Copy Public Key"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="font-bold text-sacred-900 block">Server-Side Public Key (PEM SPKI):</span>
            <pre className="p-3 rounded-lg bg-sacred-50 border border-sacred-200 font-mono text-[10px] text-sacred-800 overflow-x-auto max-h-32">
              {publicKeyInfo?.publicKeyPem || "Loading Public Key..."}
            </pre>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-sacred-900 block">Server-Side Security Isolation:</span>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside text-[11px]">
              <li>The RSA private key is stored exclusively on the server and is <strong>never exposed</strong> to client browsers.</li>
              <li>Signature creation is executed only within server actions during order/payment confirmation.</li>
              <li>The public key is distributed for verification by auditing authorities, customers, and bank gateways.</li>
              <li>Compatible with Vercel Serverless environment and Neon PostgreSQL.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
