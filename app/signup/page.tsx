"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export default function SignupPage() {
  const router = useRouter();
  const setSession = useUserStore((s) => s.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (passwordTooShort) {
      setError("Password needs to be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await api.auth.signup(name, email, password);
      setSession(user, token);
      router.push("/account");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-walnut mb-2">Create an account</h1>
      <p className="text-walnut/60 mb-8">Track orders, save addresses, and check out faster.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-walnut mb-1">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-walnut mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-walnut mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded px-3 py-2"
          />
          {passwordTooShort && (
            <p className="text-xs text-rose mt-1">At least 8 characters.</p>
          )}
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo text-cotton rounded py-3 hover:bg-indigo-light transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-walnut/60 mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
