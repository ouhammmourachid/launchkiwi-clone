/**
 * sign-in-form.tsx
 * Email + password sign-in.
 */

"use client";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useAuthForm } from "@/hooks/use-auth-form";
import { signInSchema } from "@/lib/validation/schemas";

export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const { signIn } = useAuth();
  const { field, handleSubmit, formError, submitting } = useAuthForm({
    schema: signInSchema,
    initialValues: { email: "", password: "" },
    action: signIn,
    redirectTo,
    successMessage: "Welcome back! 👋",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && <Alert>{formError === "Failed to authenticate." ? "Incorrect email or password." : formError}</Alert>}
      <TextField label="Email" type="email" autoComplete="email" {...field("email")} />
      <TextField label="Password" type="password" autoComplete="current-password" {...field("password")} />
      <Button type="submit" loading={submitting} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
