/**
 * Form input schemas. The same rules are enforced server-side by
 * PocketBase field constraints and pb_hooks — these give instant feedback.
 */

import { z } from "zod";

import { PRICING_MODELS } from "@/lib/types/records";
import { htmlTextLength } from "@/lib/utils/format";

const email = z.string().trim().toLowerCase().email("Enter a valid email address.");

/** Passwordless sign-in (and sign-up): step one asks only for the email. */
export const signInSchema = z.object({ email });
export type SignInInput = z.infer<typeof signInSchema>;

/** Length of the emailed one-time code (matches the users collection OTP settings). */
export const OTP_LENGTH = 6;

export const otpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code from your email.`),
});

export const TAGLINE_MAX = 150;
export const DESCRIPTION_MIN = 100;
export const DESCRIPTION_MAX = 1000;
export const MAX_CATEGORIES = 4;
export const LAUNCH_PRICING_MODELS = ["Free", "Freemium", "Paid"] as const satisfies readonly (typeof PRICING_MODELS)[number][];

export const productSubmitSchema = z.object({
  websiteUrl: z
    .string()
    .trim()
    .url("Enter a full URL, e.g. https://yourproduct.com")
    .refine((u) => /^https?:\/\//i.test(u), "URL must start with http:// or https://"),
  name: z.string().trim().min(2, "Name is too short.").max(80),
  tagline: z.string().trim().min(10, "Tagline should be at least 10 characters.").max(TAGLINE_MAX),
  /** Rich-text HTML from the editor; limits apply to the visible text. */
  description: z
    .string()
    .refine((html) => htmlTextLength(html) >= DESCRIPTION_MIN, `Describe your product in at least ${DESCRIPTION_MIN} characters.`)
    .refine((html) => htmlTextLength(html) <= DESCRIPTION_MAX, `Keep the description under ${DESCRIPTION_MAX} characters.`),
  categories: z.array(z.string()).min(1, "Pick at least one category.").max(MAX_CATEGORIES, `Pick up to ${MAX_CATEGORIES} categories.`),
  pricing: z.enum(PRICING_MODELS),
});
export type ProductSubmitInput = z.infer<typeof productSubmitSchema>;

/** Makers can edit everything but the name and URL once a product is submitted. */
export const productEditSchema = productSubmitSchema.omit({ websiteUrl: true, name: true });
export type ProductEditInput = z.infer<typeof productEditSchema>;

export const LOGO_MAX_BYTES = 2 * 1024 * 1024;
export const LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
export const SCREENSHOT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Write something first.").max(1000, "Comments are limited to 1000 characters."),
});

export const guestCommentSchema = commentSchema.extend({
  name: z.string().trim().min(2, "Please enter your name.").max(50, "Names are limited to 50 characters."),
});

export const subscribeSchema = z.object({ email });

/** Booking a homepage spotlight ad (/advertise). Mirrors pb_hooks/ads.pb.js. */
export const adBookingSchema = z.object({
  productName: z.string().trim().min(2, "Please enter your product name.").max(80, "Keep the name under 80 characters."),
  websiteUrl: z
    .string()
    .trim()
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
    .pipe(z.string().regex(/^https?:\/\/[^\s/.]+\.[^\s]+$/i, "Enter a valid website URL.")),
  tagline: z.string().trim().min(5, "Add a one-line tagline.").max(140, "Keep the tagline under 140 characters."),
  email,
});
export type AdBookingInput = z.infer<typeof adBookingSchema>;

/** Maps a failed parse to `{ field: firstMessage }` for inline form errors. */
export function fieldErrors<T>(error: z.ZodError<T>): Partial<Record<keyof T, string>> {
  const out: Partial<Record<keyof T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T;
    out[key] ??= issue.message;
  }
  return out;
}
