"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export default function AddressesPage() {
  const router = useRouter();
  const { user, hydrate } = useUserStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user === null) {
      const timeout = setTimeout(() => {
        if (!sessionStorage.getItem("sirya_user")) {
          router.push("/login");
        }
      }, 100);

      return () => clearTimeout(timeout);
    }

    // Temporary: address API not added yet
    setLoading(false);
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/account"
          className="text-sm text-walnut/60 hover:text-walnut"
        >
          ← Account
        </Link>

        <h1 className="font-display text-2xl text-walnut">
          Addresses
        </h1>
      </div>

      {loading ? (
        <p className="text-walnut/60 text-sm">
          Loading addresses…
        </p>
      ) : addresses.length === 0 ? (
        <div className="border border-line rounded p-8 text-center">
          <p className="text-walnut text-lg mb-2">
            No saved addresses
          </p>

          <p className="text-walnut/60 text-sm">
            Your saved shipping addresses will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-line rounded p-5"
            >
              <p className="font-medium text-walnut">
                {address.name}
              </p>

              <p className="text-sm text-walnut/70 mt-2">
                {address.address}
              </p>

              <p className="text-sm text-walnut/70">
                {address.city}, {address.state} - {address.pincode}
              </p>

              <p className="text-sm text-walnut/70 mt-2">
                Phone: {address.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}