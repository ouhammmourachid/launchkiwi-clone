"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { z } from "zod";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/pb/errors";
import { fieldErrors } from "@/lib/validation/schemas";

/**
 * Shared state machine for the sign-in / sign-up forms: field values,
 * zod validation, submit, error message, and redirect once signed in.
 */
export function useAuthForm<S extends z.ZodTypeAny>({
  schema,
  initialValues,
  action,
  redirectTo,
  successMessage,
}: {
  schema: S;
  initialValues: Record<keyof z.infer<S>, string>;
  action: (input: z.infer<S>) => Promise<void>;
  redirectTo: string;
  successMessage: string;
}) {
  type Field = keyof z.infer<S>;
  const { user, isReady } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in (or just signed in): leave the auth page.
  useEffect(() => {
    if (isReady && user) router.replace(redirectTo);
  }, [isReady, user, router, redirectTo]);

  const field = (name: Field) => ({
    value: values[name],
    error: errors[name],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
      setErrors((errs) => ({ ...errs, [name]: undefined }));
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error) as Partial<Record<Field, string>>);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await action(parsed.data);
      toast(successMessage); // the effect above redirects once the session lands
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return { field, handleSubmit, formError, submitting };
}
