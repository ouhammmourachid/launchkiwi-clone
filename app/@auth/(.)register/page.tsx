import { AuthModal } from "@/components/auth/auth-modal";
import { SignUpView } from "@/components/auth/auth-views";
import { safeRedirect } from "@/lib/utils/safe-redirect";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** /register opened via client navigation: shown as a modal over the current page. */
export default async function SignUpModal({ searchParams }: { searchParams: SearchParams }) {
  const next = safeRedirect((await searchParams).next);
  return (
    <AuthModal>
      <SignUpView next={next} inModal />
    </AuthModal>
  );
}
