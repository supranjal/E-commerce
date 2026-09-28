import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://rudrakart.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/account",
          "/cart",
          "/checkout",
          "/login",
          "/register",
          "/order-success",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
