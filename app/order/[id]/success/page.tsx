import Link from "next/link";

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-walnut mb-3">Order placed</h1>
      <p className="text-walnut/60 mb-1">
        Order <span className="font-medium text-walnut">#{params.id.slice(0, 8)}</span> is confirmed.
      </p>
      <p className="text-walnut/60 mb-8">We'll email you when it ships.</p>
      <Link href="/" className="inline-block bg-indigo text-cotton px-6 py-3 rounded">
        Continue shopping
      </Link>
    </div>
  );
}
