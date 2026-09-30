"use client";

import { FormEvent, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactInquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 space-y-2 text-sm">
        <p className="font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Inquiry recorded locally
        </p>
        <p className="text-xs text-emerald-800">
          Thank you for reaching out. Our Himalayan customer advisory team will review your inquiry and respond shortly.
        </p>
        <button
          type="button"
          className="text-xs font-semibold text-saffron-800 hover:underline"
          onClick={() => setSubmitted(false)}
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-1.5">
        <label className="font-bold text-sacred-900">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Aarav Sharma"
          className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-sacred-900">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="e.g. aarav@example.com"
          className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-sacred-900">
          Interested Mukhi / Query
        </label>
        <input
          type="text"
          name="topic"
          placeholder="e.g. Inquiring about 14 Mukhi certificate or custom silver capping"
          className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-sacred-900">Message</label>
        <textarea
          name="message"
          rows={4}
          placeholder="Please describe your requirements..."
          className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
          required
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
        <Send className="w-4 h-4" /> Submit Inquiry
      </Button>
    </form>
  );
}
