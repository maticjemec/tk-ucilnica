import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "field h-10 w-full px-3 py-0 text-[0.875rem] [color-scheme:light]";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function AdminField({ id, label, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.8125rem] font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[0.75rem] text-muted">{hint}</p> : null}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  id: string;
  label: string;
  hint?: string;
  className?: string;
};

export function AdminInput({ id, label, hint, className, ...props }: InputProps) {
  return (
    <AdminField id={id} label={label} hint={hint} className={className}>
      <input id={id} name={id} className={controlClass} {...props} />
    </AdminField>
  );
}

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id" | "className"
> & {
  id: string;
  label: string;
  hint?: string;
  className?: string;
};

export function AdminTextarea({
  id,
  label,
  hint,
  className,
  ...props
}: TextareaProps) {
  return (
    <AdminField id={id} label={label} hint={hint} className={className}>
      <textarea
        id={id}
        name={id}
        className={cn("field min-h-28 w-full px-3 py-2.5 text-[0.875rem]")}
        {...props}
      />
    </AdminField>
  );
}

type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "id" | "className"
> & {
  id: string;
  label: string;
  hint?: string;
  className?: string;
};

export function AdminSelect({
  id,
  label,
  hint,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <AdminField id={id} label={label} hint={hint} className={className}>
      <select id={id} name={id} className={cn(controlClass, "appearance-auto")} {...props}>
        {children}
      </select>
    </AdminField>
  );
}

type CheckboxProps = {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export function AdminCheckbox({
  id,
  name,
  label,
  hint,
  checked,
  defaultChecked,
  onChange,
}: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
      <input
        id={id}
        name={name ?? id}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={
          onChange ? (event) => onChange(event.target.checked) : undefined
        }
        className="mt-0.5 size-4 accent-[var(--accent)]"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint ? <span className="mt-0.5 block text-[0.75rem] text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}
