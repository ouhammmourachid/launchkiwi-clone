/**
 * email-code-form.tsx
 * Passwordless sign-in, which doubles as sign-up. Step one emails a one-time
 * code (the server creates the account if the email is new); step two
 * exchanges the code for a session. Codes come from PocketBase's OTP auth.
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/pb/errors";
import { OTP_LENGTH, otpCodeSchema, signInSchema } from "@/lib/validation/schemas";

/** Seconds before another code can be requested. */
const RESEND_COOLDOWN = 30;

export function EmailCodeForm({ redirectTo }: { redirectTo: string }) {
  const { user, isReady, requestSignInCode, verifyCode } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [otpId, setOtpId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Already signed in (or just signed in): leave the auth page.
  useEffect(() => {
    if (isReady && user) router.replace(redirectTo);
  }, [isReady, user, router, redirectTo]);

  // Tick the resend cooldown down once a second.
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  /** Validates step one and emails a code; returns whether one was sent. */
  const sendCode = async (): Promise<boolean> => {
    const parsed = signInSchema.safeParse({ email });
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message);
      return false;
    }
    setSending(true);
    setFormError(null);
    try {
      const id = await requestSignInCode(parsed.data);
      setOtpId(id);
      setResendIn(RESEND_COOLDOWN);
      return true;
    } catch (err) {
      setFormError(getErrorMessage(err, "We couldn't send your code. Please try again."));
      return false;
    } finally {
      setSending(false);
    }
  };

  const handleDetails = (e: FormEvent) => {
    e.preventDefault();
    void sendCode();
  };

  if (!otpId) {
    return (
      <form onSubmit={handleDetails} className="space-y-4" noValidate>
        {formError && <Alert>{formError}</Alert>}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoFocus
          value={email}
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(undefined);
          }}
        />
        <Button type="submit" loading={sending} className="w-full">
          Email me a sign-in code
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-dune-500">
          No password needed. New here? The same code creates your free account.
        </p>
      </form>
    );
  }

  return (
    <CodeStep
      email={email.trim()}
      sending={sending}
      resendIn={resendIn}
      error={formError}
      onResend={() => void sendCode()}
      onChangeEmail={() => {
        setOtpId(null);
        setFormError(null);
      }}
      onVerify={async (code) => {
        setFormError(null);
        try {
          await verifyCode(otpId, code);
          toast("You're signed in. Welcome to LaunchDunes! ☀️"); // the effect above redirects once the session lands
          return true;
        } catch (err) {
          const message = getErrorMessage(err);
          // PocketBase says "Invalid or expired OTP." — say it in the product's words.
          setFormError(/otp|authenticate/i.test(message) ? "That code is wrong or has expired. Check your email or send a new code." : message);
          return false;
        }
      }}
    />
  );
}

interface CodeStepProps {
  email: string;
  sending: boolean;
  resendIn: number;
  error: string | null;
  onResend: () => void;
  onChangeEmail: () => void;
  /** Resolves true once signed in. */
  onVerify: (code: string) => Promise<boolean>;
}

function CodeStep({ email, sending, resendIn, error, onResend, onChangeEmail, onVerify }: CodeStepProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  // Example digits as the placeholder; CodeStep only renders client-side, so no hydration mismatch.
  const [placeholder] = useState(() =>
    Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join(""),
  );

  const verify = async (value: string) => {
    const parsed = otpCodeSchema.safeParse({ code: value });
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message ?? "Enter the code from your email.");
      return;
    }
    setCodeError(null);
    setVerifying(true);
    const ok = await onVerify(parsed.data.code);
    setVerifying(false);
    if (ok) {
      setDone(true);
      return;
    }
    // Wrong or expired: clear it so the next attempt starts fresh.
    // The input re-enables on the next render, so focus it after that.
    setCode("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCode(digits);
    setCodeError(null);
    // Pasted or autofilled in full: sign in straight away.
    if (digits.length === OTP_LENGTH && !verifying) void verify(digits);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void verify(code);
  };

  const message = codeError ?? error;
  const describedBy = `${id}-help${message ? ` ${id}-error` : ""}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div id={`${id}-help`} className="rounded-xl border border-dune-850 bg-dune-925 px-4 py-3 text-center text-xs leading-relaxed text-dune-300">
        We sent a {OTP_LENGTH}-digit code to <span className="font-semibold break-all text-white">{email}</span>. It expires in 10
        minutes.
      </div>

      <div>
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-dune-100">
          {OTP_LENGTH}-digit code
        </label>
        <input
          ref={inputRef}
          id={id}
          value={code}
          onChange={handleChange}
          autoFocus
          autoComplete="one-time-code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          placeholder={placeholder}
          aria-invalid={!!message}
          aria-describedby={describedBy}
          disabled={verifying || done}
          className={`w-full rounded-xl border bg-dune-990 px-3.5 py-3 text-center font-mono text-2xl font-bold tracking-[0.5em] text-white tabular-nums placeholder:text-dune-700 outline-none transition focus:border-sun disabled:opacity-60 ${
            message ? "border-[#7f2d26]" : "border-dune-900"
          }`}
        />
        {message && (
          <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11px] font-medium text-danger">
            {message}
          </p>
        )}
      </div>

      <Button type="submit" loading={verifying || done} className="w-full">
        Sign in
      </Button>

      <div className="flex items-center justify-between gap-3 text-xs">
        <button type="button" onClick={onChangeEmail} className="cursor-pointer font-semibold text-dune-400 transition-colors hover:text-sun">
          ← Use a different email
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resendIn > 0 || sending}
          className="cursor-pointer font-semibold text-sun transition-colors hover:text-sun-bright disabled:cursor-not-allowed disabled:text-dune-600"
        >
          {sending ? "Sending…" : resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
