"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const sessionUser = session.user as any;
  if (sessionUser.id) {
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });
    if (user) return user;
  }

  if (sessionUser.email) {
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email.toLowerCase().trim() },
    });
    if (user) return user;
  }

  return null;
}

export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Check verified buyer status for each reviewer
    const reviewsWithVerifiedStatus = await Promise.all(
      reviews.map(async (r) => {
        const orderItem = await prisma.orderItem.findFirst({
          where: {
            productId,
            order: {
              OR: [
                { userId: r.userId },
                { customerEmail: r.user.email },
              ],
              paymentStatus: "PAID",
            },
          },
        });

        return {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          userName: r.user.name,
          userId: r.userId,
          isVerifiedBuyer: Boolean(orderItem),
        };
      })
    );

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
            ).toFixed(1)
          )
        : 5.0;

    const ratingCounts = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return {
      success: true,
      reviews: reviewsWithVerifiedStatus,
      totalReviews,
      averageRating,
      ratingCounts,
    };
  } catch (error: any) {
    return {
      success: false,
      reviews: [],
      totalReviews: 0,
      averageRating: 5.0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      error: error.message || "Failed to load reviews.",
    };
  }
}

export async function submitProductReview(input: {
  productId: string;
  rating: number;
  comment?: string;
  productSlug?: string;
}) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return {
        success: false,
        error: "Please sign in to write and share your review.",
      };
    }

    if (!input.productId) {
      return { success: false, error: "Invalid product." };
    }

    if (!input.rating || input.rating < 1 || input.rating > 5) {
      return { success: false, error: "Please select a rating between 1 and 5 stars." };
    }

    const trimmedComment = input.comment?.trim() || null;

    // Check if user already submitted a review for this product
    const existing = await prisma.review.findFirst({
      where: {
        productId: input.productId,
        userId: user.id,
      },
    });

    let savedReview;
    if (existing) {
      savedReview = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: Math.round(input.rating),
          comment: trimmedComment,
        },
      });
    } else {
      savedReview = await prisma.review.create({
        data: {
          productId: input.productId,
          userId: user.id,
          rating: Math.round(input.rating),
          comment: trimmedComment,
        },
      });
    }

    if (input.productSlug) {
      revalidatePath(`/products/${input.productSlug}`);
    }

    return {
      success: true,
      review: {
        id: savedReview.id,
        rating: savedReview.rating,
        comment: savedReview.comment,
        createdAt: savedReview.createdAt.toISOString(),
      },
      message: existing
        ? "Your review has been updated successfully."
        : "Thank you! Your review has been submitted and is now visible.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred while posting your review.",
    };
  }
}
