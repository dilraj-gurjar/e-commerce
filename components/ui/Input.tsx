import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm text-walnut">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full border border-line rounded px-3 py-2 outline-none focus:border-walnut ${className}`}
      />

      {error && (
        <p className="text-sm text-rose">
          {error}
        </p>
      )}
    </div>
  );
}