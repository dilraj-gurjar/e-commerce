import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { api } from "@/lib/api";

const categories = [
  { name: "Bedsheets", slug: "bedsheets", image: "/images/cat-bedsheets.jpg" },
  { name: "Comforters", slug: "comforters", image: "/images/cat-comforters.jpg" },
  { name: "Blankets", slug: "blankets", image: "/images/cat-blankets.jpg" },
];

export default async function HomePage() {
  const { products } = await api.products.list();

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow text-turmeric-dark">Woven for home</p>
          <h1 className="font-display text-5xl leading-tight text-walnut mt-3">
            Fabric that remembers where you rest.
          </h1>
          <p className="text-walnut/70 mt-5 max-w-md">
            Sirya makes bedsheets, comforters and throws using traditional
            block-print and hand-stitch techniques, reworked for daily wear.
          </p>
          <Link
            href="/category/bedsheets"
            className="inline-block mt-8 bg-indigo text-cotton px-6 py-3 rounded hover:bg-indigo-light transition-colors"
          >
            Shop bedsheets
          </Link>
        </div>
        <div className="aspect-square rounded bg-sand overflow-hidden">
          <img src="/images/hero-bedroom.jpg" alt="Sirya bedroom styled in indigo linens" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl text-walnut mb-6">Shop by category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="relative rounded overflow-hidden aspect-[4/3] group shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-dark/60 via-indigo-dark/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-cotton font-display text-xl">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-walnut">Best sellers</h2>
          <Link href="/collections/best-seller" className="text-sm text-indigo hover:underline">
            View all
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-walnut/60 text-sm">New arrivals are on their way — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Brand story */}
      <section className="bg-sand py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="eyebrow text-turmeric-dark">Our story</p>
          <h2 className="font-display text-3xl text-walnut mt-3">
            Comfort shouldn't need translation.
          </h2>
          <p className="text-walnut/70 mt-4">
            Sirya works directly with weaving clusters across India, pairing
            traditional dye and stitch work with fabric built for daily wash
            and wear. No middle layer, no markup for the sake of it.
          </p>
        </div>
      </section>
    </>
  );
}