export type Variant = {
  size: string;
  price: number;
  compareAt?: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  variants: Variant[];
  description: string;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "indigo-block-print-bedsheet",
    name: "Indigo Block Print Bedsheet Set",
    category: "bedsheets",
    rating: 4.8,
    reviewCount: 214,
    image: "/images/indigo-block-print.jpg",
    variants: [
      { size: "Double", price: 1499, compareAt: 2999, stock: 14 },
      { size: "King", price: 1699, compareAt: 3299, stock: 6 },
    ],
    description:
      "Hand block-printed cotton bedsheet in traditional indigo dye. Set includes two pillow covers.",
  },
  {
    id: "p2",
    slug: "turmeric-weave-comforter",
    name: "Turmeric Weave Comforter",
    category: "comforters",
    rating: 4.6,
    reviewCount: 98,
    image: "/images/turmeric-weave.jpg",
    variants: [{ size: "Single", price: 1799, compareAt: 2999, stock: 22 }],
    description:
      "Lightweight all-season comforter woven in a warm mustard tone, filled with soft microfiber.",
  },
  {
    id: "p3",
    slug: "kantha-stitch-throw",
    name: "Kantha Stitch Throw Blanket",
    category: "blankets",
    rating: 4.9,
    reviewCount: 156,
    image: "/images/kantha-throw.jpg",
    variants: [{ size: "Standard", price: 1299, compareAt: 2199, stock: 3 }],
    description:
      "Hand-stitched kantha throw made from upcycled cotton layers, reversible print.",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}
