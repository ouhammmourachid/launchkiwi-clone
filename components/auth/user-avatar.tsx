/**
 * user-avatar.tsx
 * Round avatar image, or the user's initial on a green disc.
 */

import Image from "next/image";

interface UserAvatarProps {
  user: { name: string; avatarUrl: string | null };
  size?: number;
}

export function UserAvatar({ user, size = 32 }: UserAvatarProps) {
  if (user.avatarUrl) {
    return (
      <Image src={user.avatarUrl} alt="" width={size} height={size} unoptimized className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-sun font-black text-on-sun"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}
