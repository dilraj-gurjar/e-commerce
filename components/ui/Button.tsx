"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
};

export default function Button({
  variant = "primary",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "rounded px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-walnut text-white hover:opacity-90",
    secondary: "border border-line text-walnut hover:bg-walnut/5",
    danger: "bg-rose text-white hover:opacity-90",
    ghost: "text-walnut hover:bg-walnut/5",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}