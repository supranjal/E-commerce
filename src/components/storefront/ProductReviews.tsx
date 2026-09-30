"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Star,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductReviews, submitProductReview } from "@/actions/review-actions";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  productSlug: string;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  userName: string;
  userId: string;
  isVerifiedBuyer: boolean;
}

export function ProductReviews({
  productId,
  productName,
  productSlug,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(5.0);
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await getProductReviews(productId);
      if (res.success && res.reviews) {
        setReviews(res.reviews);
        setTotalReviews(res.totalReviews);
        setAverageRating(res.averageRating);
        setRatingCounts(res.ratingCounts);

        // Prepopulate if current user already left a review
        const currentUserId = (session?.user as any)?.id;
        const existing = res.reviews.find((r) => r.userId === currentUserId);
        if (existing) {
          setRating(existing.rating);
          setComment(existing.comment || "");
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      const res = await submitProductReview({
        productId,
        rating,
        comment,
        productSlug,
      });

      if (!res.success) {
        setFormError(res.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }

      setFormSuccess(res.message || "Thank you! Your review has been published.");
      await fetchReviews();
      setShowForm(false);
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const starLabels: Record<number, string> = {
    5: "5 Stars - Exceptional Consecration & Quality",
    4: "4 Stars - Very Good Specimen",
    3: "3 Stars - Satisfactory",
    2: "2 Stars - Fair / Minor Concerns",
    1: "1 Star - Did Not Meet Expectations",
  };

  return (
    <section id="customer-reviews" className="pt-12 border-t border-sacred-200 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sacred-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-saffron-800 font-bold text-xs uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Customer Feedback</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950 mt-1">
            Ratings & Authentic Reviews
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Genuine experiences shared by verified seekers and devotees who received this specimen.
          </p>
        </div>

        {session?.user ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
            className="self-start md:self-auto gap-2 border-sacred-300 text-sacred-900 hover:bg-sacred-50"
          >
            <Sparkles className="w-4 h-4 text-saffron-600" />
            {showForm ? "Cancel Review" : "Write a Review"}
          </Button>
        ) : (
          <Button variant="outline" asChild className="self-start md:self-auto gap-2">
            <Link href={`/login?callbackUrl=/products/${productSlug}#customer-reviews`}>
              Sign In to Review
            </Link>
          </Button>
        )}
      </div>

      {/* Review Submission Form Drawer / Card */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-sacred-50/80 border border-sacred-300 shadow-xs space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-sacred-200 pb-3">
            <h3 className="font-serif font-bold text-sacred-950 text-base">
              Share Your Experience with {productName}
            </h3>
            <span className="text-xs text-muted-foreground">
              Posting as <strong>{session?.user?.name || session?.user?.email}</strong>
            </span>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Star Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-sacred-900">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const activeVal = hoverRating || rating;
                const isFilled = starVal <= activeVal;

                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starVal)}
                    className="p-1 focus:outline-hidden hover:scale-110 transition-transform"
                    aria-label={`Rate ${starVal} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        isFilled
                          ? "fill-gold-500 text-gold-600"
                          : "text-sacred-300 fill-transparent"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-3 text-xs font-medium text-sacred-700">
                {starLabels[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Comment text */}
          <div className="space-y-1.5">
            <label
              htmlFor="review-comment"
              className="block text-xs font-semibold text-sacred-900"
            >
              Your Written Review
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the physical condition, vibration, ritual consecration packaging, or your personal satisfaction with this sacred bead..."
              className="w-full text-xs p-3 rounded-xl border border-sacred-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                "Publish Customer Review"
              )}
            </Button>
          </div>
        </form>
      )}

      {formSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Overview & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Rating Summary Card */}
        <div className="md:col-span-4 p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-4">
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="font-serif text-4xl font-bold text-sacred-950">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                out of 5.0
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-gold-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(averageRating)
                      ? "fill-gold-500 text-gold-600"
                      : "text-sacred-200 fill-transparent"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-1.5 pt-2 border-t border-sacred-100 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars] || 0;
              const percentage =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-12 text-[11px] text-muted-foreground">
                    {stars} stars
                  </span>
                  <div className="flex-1 h-2 bg-sacred-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-mono text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="md:col-span-8 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-saffron-700" />
              <p>Loading verified customer reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-sacred-50/60 border border-dashed border-sacred-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sacred-100 text-sacred-500 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sacred-950 text-sm">
                  No Reviews Yet
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Be the first verified customer to share your thoughts on this authentic Himalayan specimen.
                </p>
              </div>
              {session?.user && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setShowForm(true)}
                  className="mt-2"
                >
                  Write the First Review
                </Button>
              )}
            </div>
          ) : (
            reviews.map((rev) => {
              const dateStr = new Date(rev.createdAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "short", day: "numeric" }
              );
              const initials = (rev.userName || "Customer")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-saffron-100 text-saffron-800 flex items-center justify-center font-serif font-bold text-xs">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sacred-950 text-sm">
                            {rev.userName}
                          </span>
                          {rev.isVerifiedBuyer && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Reviewed on {dateStr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-gold-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? "fill-gold-500 text-gold-600"
                              : "text-sacred-200 fill-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-sacred-800 leading-relaxed whitespace-pre-line pl-12">
                      {rev.comment}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
