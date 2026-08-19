import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type AuthFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "className"
> & {
  id: string;
  name: string;
  label: string;
  error?: string;
};

export function AuthField({
  id,
  name,
  label,
  error,
  ...inputProps
}: AuthFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.8125rem] font-medium leading-none tracking-[-0.01em] text-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "field h-11 px-3.5 py-0 text-[0.875rem]",
          error && "border-danger",
        )}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-[0.8125rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
