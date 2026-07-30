export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  compare_at: number | null;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  review_count: number;
  variants: ProductVariant[];
};