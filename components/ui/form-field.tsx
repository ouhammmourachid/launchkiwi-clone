/**
 * form-field.tsx
 * Labelled input / textarea / select with inline error text, wired up
 * with the right aria attributes.
 */

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

const CONTROL =
  "w-full rounded-xl border bg-dune-990 px-3.5 py-2.5 text-sm text-white placeholder:text-dune-700 outline-none transition focus:border-sun";

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  children: (props: { id: string; className: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}

function FieldShell({ label, error, hint, children }: FieldShellProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-dune-100">
        {label}
      </label>
      {children({
        id,
        className: `${CONTROL} ${error ? "border-[#7f2d26]" : "border-dune-900"}`,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
      })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[11px] font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-dune-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Common = { label: string; error?: string; hint?: ReactNode };

export function TextField({ label, error, hint, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(control) => <input {...control} {...props} />}
    </FieldShell>
  );
}

export function TextAreaField({ label, error, hint, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(control) => <textarea {...control} {...props} />}
    </FieldShell>
  );
}

export function SelectField({ label, error, hint, children, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(control) => (
        <select {...control} {...props}>
          {children}
        </select>
      )}
    </FieldShell>
  );
}
