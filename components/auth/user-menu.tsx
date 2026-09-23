/**
 * user-menu.tsx
 * Header auth area: "Sign In" when signed out, avatar + dropdown when signed in.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { UserAvatar } from "@/components/auth/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function UserMenu() {
  const { user, isReady, signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  // Reserve space during hydration so the header doesn't jump.
  if (!isReady) return <span className="inline-block h-8 w-14" aria-hidden />;

  if (!user) {
    const next = pathname && pathname !== "/login" && pathname !== "/register" ? `?next=${encodeURIComponent(pathname)}` : "";
    return (
      <Link href={`/login${next}`} className="text-xs font-semibold text-[#c5ceb8] transition hover:text-white px-2 py-1">
        Sign In
      </Link>
    );
  }

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    toast("Signed out. See you soon!");
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-[#23291b] bg-[#141810] py-1 pl-1 pr-3 text-xs font-semibold text-white transition hover:border-[#3c452c] cursor-pointer"
      >
        <UserAvatar user={user} size={24} />
        <span className="hidden max-w-[110px] truncate sm:inline">{user.name}</span>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-[#22271a] bg-[#11140c] py-1 shadow-xl">
          <div className="border-b border-[#1c2014] px-3.5 py-2.5">
            <p className="truncate text-xs font-bold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-[#727c65]">{user.email}</p>
          </div>
          <MenuLink href="/account" onSelect={() => setOpen(false)}>My account</MenuLink>
          <MenuLink href="/launch" onSelect={() => setOpen(false)}>Launch a product</MenuLink>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="block w-full px-3.5 py-2 text-left text-xs font-semibold text-[#f87171] transition hover:bg-[#1a1e13] cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, onSelect, children }: { href: string; onSelect: () => void; children: React.ReactNode }) {
  return (
    <Link role="menuitem" href={href} onClick={onSelect} className="block px-3.5 py-2 text-xs font-semibold text-[#c5ceb8] transition hover:bg-[#1a1e13] hover:text-white">
      {children}
    </Link>
  );
}
