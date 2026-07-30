import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product;
  try {
    ({ product } = await api.products.get(params.slug));
  } catch {
    return notFound();
  }

  return <ProductDetailClient product={product} />;
}
