import { ProductItem } from "@/types";
import { getProducts } from "@/actions/product-actions";

export interface RecommendationResult {
  sameMukhiProducts: ProductItem[];
  matchingAccessories: ProductItem[];
  similarTierProducts: ProductItem[];
}

export async function getRecommendationsForProduct(
  currentProduct: ProductItem
): Promise<RecommendationResult> {
  const allProducts = await getProducts();

  // 1. Same Mukhi items (e.g., Mala or Bracelet with same face count)
  const sameMukhiProducts = allProducts.filter(
    (p) =>
      p.id !== currentProduct.id &&
      currentProduct.mukhi &&
      p.mukhi === currentProduct.mukhi
  );

  // 2. Accessories (Boxes, Silver Caps, Malas)
  const matchingAccessories = allProducts.filter(
    (p) =>
      p.id !== currentProduct.id &&
      (p.categoryId === "cat-5" ||
        p.category?.slug === "puja-accessories" ||
        p.categoryId === "cat-4" ||
        p.category?.slug === "rudraksha-bracelets")
  );

  // 3. Similar Price Tier (+- 50% price range or same category)
  const minPrice = currentProduct.price * 0.5;
  const maxPrice = currentProduct.price * 1.5;
  const similarTierProducts = allProducts.filter(
    (p) =>
      p.id !== currentProduct.id &&
      p.price >= minPrice &&
      p.price <= maxPrice &&
      !sameMukhiProducts.some((sm) => sm.id === p.id)
  );

  return {
    sameMukhiProducts: sameMukhiProducts.slice(0, 4),
    matchingAccessories: matchingAccessories.slice(0, 4),
    similarTierProducts: similarTierProducts.slice(0, 4),
  };
}
