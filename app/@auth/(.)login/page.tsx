import { AuthModal } from "@/components/auth/auth-modal";
import { SignInView } from "@/components/auth/auth-views";
import { safeRedirect } from "@/lib/utils/safe-redirect";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** /login opened via client navigation: shown as a modal over the current page. */
export default async function SignInModal({ searchParams }: { searchParams: SearchParams }) {
  const next = safeRedirect((await searchParams).next);
  return (
    <AuthModal>
      <SignInView next={next} inModal />
    </AuthModal>
  );
}
