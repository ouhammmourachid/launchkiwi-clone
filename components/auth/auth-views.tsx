/**
 * auth-views.tsx
 * Sign-in and sign-up content, rendered by both the /login and /register
 * pages and their intercepted modal versions in app/@auth.
 */

import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

interface AuthViewProps {
  next: string;
  inModal?: boolean;
}

const SWITCH_LINK = "font-bold text-sun hover:underline";

export function SignInView({ next, inModal = false }: AuthViewProps) {
  return (
    <AuthCard
      inModal={inModal}
      title="Welcome back"
      subtitle="Sign in to upvote, comment and launch your products."
      footer={
        <>
          New to LaunchDunes?{" "}
          {/* replace: switching tabs inside the modal shouldn't stack history entries. */}
          <Link href={`/register?next=${encodeURIComponent(next)}`} replace={inModal} className={SWITCH_LINK}>
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm redirectTo={next} />
    </AuthCard>
  );
}

export function SignUpView({ next, inModal = false }: AuthViewProps) {
  return (
    <AuthCard
      inModal={inModal}
      title="Create your account"
      subtitle="Free forever. Launch products, upvote and join the discussion."
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} replace={inModal} className={SWITCH_LINK}>
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm redirectTo={next} />
    </AuthCard>
  );
}
