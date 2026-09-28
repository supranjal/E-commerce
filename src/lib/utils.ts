import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProductItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductImageUrl(product: ProductItem): string {
  const imageUrl = product.images?.[0]?.url?.trim();

  // Use the bundled 1-mukhi photograph rather than stale database image URLs.
  if (product.slug === "1-mukhi-rudraksha-nepal") {
    return "/images/products/1-mukhi-chandrakar-rudraksha.jpg";
  }

  // If a valid image URL is provided in the product object, prioritize it
  if (imageUrl && !imageUrl.includes("photo-1609743522653")) {
    return imageUrl;
  }

  const onlineProductImages: Record<string, string> = {
    "1-mukhi-rudraksha-nepal":
      "/images/products/1-mukhi-chandrakar-rudraksha.jpg",
    "2-mukhi-rudraksha-nepal":
      "https://ts1.mm.bing.net/th?id=OIP.kGpFdpGs5ilrVaL0iql8OgHaHa",
    "3-mukhi-rudraksha-nepal":
      "https://ts4.mm.bing.net/th?id=OIP.ZbzHJgpXRP69L2gNZbXCYQHaHa",
    "4-mukhi-rudraksha-nepal":
      "https://ts3.mm.bing.net/th?id=OIP.pwfHdib3ecQD9Gg4LeJ11wHaJQ",
    "5-mukhi-rudraksha-nepal":
      "https://ts4.mm.bing.net/th?id=OIP.rZY3ms5WZEMPRpSHNFor9QHaHa",
    "6-mukhi-rudraksha-nepal":
      "https://ts2.mm.bing.net/th?id=OIP.rkwEi9sJxnhKq-9kr2JgJQHaHa",
    "7-mukhi-rudraksha-nepal":
      "https://ts3.mm.bing.net/th?id=OIP.w7zmDTYftl6b9RGYM9K2-gHaHa",
    "8-mukhi-rudraksha-nepal":
      "https://ts1.mm.bing.net/th?id=OIP.YwCBO8hrghUAZRnK0uo2pQHaHa",
    "9-mukhi-rudraksha-nepal":
      "https://ts1.mm.bing.net/th?id=OIP.ENWgFtYnuLKYaNE-EDpH0wHaHa",
    "10-mukhi-rudraksha-nepal":
      "https://ts1.mm.bing.net/th?id=OIP.YqT1Yf-sqMQXw_ZWnaN0GQHaHa",
    "14-mukhi-rudraksha-nepal":
      "https://ts2.mm.bing.net/th?id=OIP._ec1DTiMx2NfNv6TJY-gbwHaEK",
    "gauri-shankar-rudraksha-nepal":
      "https://ts2.mm.bing.net/th?id=OIP.wa7n4Spy1zJA628fwCgkzAHaHa",
    "ganesh-rudraksha-nepal":
      "https://ts4.mm.bing.net/th?id=OIP.5T-Md0ZvKyBfhEMgNz50UwHaHa",
    "108-beads-5-mukhi-nepali-japa-mala":
      "https://ts4.mm.bing.net/th?id=OIP.ReVe1MT1YwuKxqe5HbicggHaHa",
    "silver-capped-5-mukhi-bracelet":
      "https://ts1.mm.bing.net/th?id=OIP.c5lHJm1PWdpRSPFu_Byz8AHaHa",
    "carved-teakwood-rudraksha-box":
      "https://ts4.mm.bing.net/th?id=OIP.QPKqy-hlSFfUofeFvdAnvAHaHa",
  };

  if (onlineProductImages[product.slug])
    return onlineProductImages[product.slug];
  if (imageUrl) return imageUrl;
  return onlineProductImages["5-mukhi-rudraksha-nepal"];
}

export function formatPrice(
  amount: number,
  currency: "NPR" | "USD" = "NPR",
  usdRate: number = 135.0,
): string {
  if (currency === "USD") {
    const usdAmount = amount / usdRate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }

  return `Rs. ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
