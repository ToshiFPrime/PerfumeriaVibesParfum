export type OlfactoryFamily =
  | "Amaderada"
  | "Cítrica"
  | "Oriental / Ámbar"
  | "Floral"
  | "Gourmand"
  | "Cuero"
  | "Acuática"
  | "Aromática";

export type Gender = "Hombre" | "Mujer" | "Unisex";

export type Concentration =
  | "Extrait de Parfum"
  | "Eau de Parfum (EDP)"
  | "Eau de Toilette (EDT)"
  | "Eau de Cologne (EDC)";

export interface OlfactoryPyramid {
  top: string[];   // Notas de Salida
  heart: string[]; // Notas de Corazón
  base: string[];  // Notas de Fondo
}

export interface ProductVariant {
  id: string;
  milliliters: number; // 5, 10, 50, 100
  label: string;       // "Decant 5ml", "Decant 10ml", "Frasco 50ml", "Frasco 100ml"
  price: number;       // en Bs.
  compareAtPrice?: number;
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  isVerifiedPurchase: boolean;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  gender: Gender;
  concentration: Concentration;
  description: string;
  olfactoryFamily: OlfactoryFamily;
  pyramid: OlfactoryPyramid;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  discountPercent?: number;
  tags?: string[];
  isActive?: boolean;
  statusReason?: string;
}

export interface CartItem {
  id: string; // unique item key: productId-variantId
  productId: string;
  productName: string;
  brand: string;
  image: string;
  variant: ProductVariant;
  quantity: number;
}

export interface DiscountCoupon {
  code: string;
  percentage: number;
  description: string;
  minSubtotal?: number;
}

export interface ShippingRate {
  department: string;
  city: string;
  cost: number;
  estimatedDays: string;
  freeShippingAbove?: number;
}

export interface CustomerOrderInfo {
  fullName: string;
  phone: string;
  city: string;
  department: string;
  address: string;
  notes?: string;
  preferredWhatsAppNumber?: "65947174" | "65867500";
}

export interface FilterState {
  searchQuery: string;
  families: OlfactoryFamily[];
  genders: Gender[];
  concentrations: Concentration[];
  brands: string[];
  sizes: number[]; // 5, 10, 50, 100
  priceRange: [number, number];
  onlySale: boolean;
  inStockOnly: boolean;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating" | "newest";
}
