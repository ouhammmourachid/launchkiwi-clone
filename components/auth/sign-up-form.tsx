/**
 * sign-up-form.tsx
 * Account creation; signs the new user in straight away.
 */

"use client";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useAuthForm } from "@/hooks/use-auth-form";
import { signUpSchema } from "@/lib/validation/schemas";

export function SignUpForm({ redirectTo }: { redirectTo: string }) {
  const { signUp } = useAuth();
  const { field, handleSubmit, formError, submitting } = useAuthForm({
    schema: signUpSchema,
    initialValues: { name: "", email: "", password: "", passwordConfirm: "" },
    action: signUp,
    redirectTo,
    successMessage: "Account created — welcome to LaunchDunes! ☀️",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && <Alert>{formError}</Alert>}
      <TextField label="Name" autoComplete="name" {...field("name")} />
      <TextField label="Email" type="email" autoComplete="email" {...field("email")} />
      <TextField label="Password" type="password" autoComplete="new-password" hint="At least 8 characters." {...field("password")} />
      <TextField label="Confirm password" type="password" autoComplete="new-password" {...field("passwordConfirm")} />
      <Button type="submit" loading={submitting} className="w-full">
        Create account
      </Button>
    </form>
  );
}
