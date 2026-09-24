/**
 * auth-views.tsx
 * The sign-in content, rendered by both the /login page and its intercepted
 * modal version in app/@auth. Sign-in doubles as sign-up (email one-time code),
 * so there is no separate register view.
 */

import { AuthCard } from "@/components/auth/auth-card";
import { EmailCodeForm } from "@/components/auth/email-code-form";

interface AuthViewProps {
  next: string;
  inModal?: boolean;
}

export function SignInView({ next, inModal = false }: AuthViewProps) {
  return (
    <AuthCard
      inModal={inModal}
      title="Sign in to LaunchDunes"
      subtitle="Upvote, comment and launch your products. We'll email you a one-time code — no password."
    >
      <EmailCodeForm redirectTo={next} />
    </AuthCard>
  );
}
