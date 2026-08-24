import type { ReactNode, SelectHTMLAttributes } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SelectOption } from "@/types/settings";

const settingsControlClass = cn(
  "field h-10 px-3.5 py-0 text-[0.875rem] [color-scheme:light]",
  "border-[color-mix(in_srgb,var(--border)_78%,var(--accent)_22%)]",
);

type FieldWrapProps = {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
};

function FieldWrap({ id, label, className, children }: FieldWrapProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.8125rem] font-medium leading-none tracking-[-0.01em] text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  className,
  disabled,
  readOnly,
}: TextFieldProps) {
  return (
    <FieldWrap id={id} label={label} className={className}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          settingsControlClass,
          (disabled || readOnly) && "cursor-default bg-canvas text-muted",
        )}
      />
    </FieldWrap>
  );
}

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
};

export function DateField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  className,
  disabled,
}: DateFieldProps) {
  return (
    <FieldWrap id={id} label={label} className={className}>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          settingsControlClass,
          "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-55",
          disabled && "cursor-default bg-canvas text-muted",
        )}
      />
    </FieldWrap>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "value" | "onChange">;

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  className,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldWrap id={id} label={label} className={className}>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            settingsControlClass,
            "appearance-none pr-10",
            selectProps.disabled && "cursor-default bg-canvas text-muted",
          )}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
          strokeWidth={1.6}
          aria-hidden
        />
      </div>
    </FieldWrap>
  );
}

type CheckboxFieldProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function CheckboxField({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-2.5",
        disabled ? "cursor-default" : "cursor-pointer",
      )}
    >
      <span className="relative mt-px shrink-0">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "flex size-[1.125rem] items-center justify-center rounded-[4px] border transition-colors",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
            checked
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-surface",
          )}
          aria-hidden
        >
          {checked ? <Check className="h-3 w-3" strokeWidth={2.4} /> : null}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="mt-1 block text-[0.8125rem] leading-snug text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

type ToggleFieldProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleField({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          checked ? "bg-accent" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </button>
    </div>
  );
}
