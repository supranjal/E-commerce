export type Currency = "NPR" | "USD";

export type Role = "CUSTOMER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "ESEWA" | "KHALTI" | "CARD" | "CASH_ON_DELIVERY";

export type VerificationStatus = "VERIFIED" | "SAMPLE_DEMO" | "PENDING_REVIEW";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mukhi?: number | null;
  isSpecial?: boolean;
  origin: string;
  size?: string | null;
  weight?: string | null;
  shape?: string | null;
  stock: number;
  featured: boolean;
  isCertified: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    altText?: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  certificates?: CertificateItem[];
}

export interface CertificateItem {
  id: string;
  productId: string;
  certificateNumber: string;
  mukhi: number;
  origin: string;
  dimensions?: string | null;
  weightGrams?: number | null;
  inspectionDate: Date | string;
  laboratory: string;
  xrayStatus?: string | null;
  microscopicCheck?: string | null;
  certificateUrl?: string | null;
  verificationStatus: VerificationStatus;
}

export interface CartItemModel {
  id: string;
  productId: string;
  product: ProductItem;
  quantity: number;
}

export interface PaymentTransactionRecord {
  id: string;
  transactionId: string;
  orderId: string;
  orderNumber?: string;
  customerName?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionHash: string;
  digitalSignature: string;
  signatureAlgorithm: string;
  canonicalPayload?: string | null;
  createdAt: Date | string;
}

export interface OrderEmailLogRecord {
  id: string;
  orderId: string;
  orderNumber?: string;
  email: string;
  notificationType: string;
  status: string;
  sentAt: Date | string;
  errorMessage?: string | null;
}
