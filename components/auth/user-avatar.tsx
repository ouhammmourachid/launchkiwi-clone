/**
 * user-avatar.tsx
 * Avatar image, or the user's initial on a sun-coloured tile. Round by default.
 */

import Image from "next/image";

interface UserAvatarProps {
  user: { name: string; avatarUrl: string | null };
  size?: number;
  shape?: "round" | "square";
}

export function UserAvatar({ user, size = 32, shape = "round" }: UserAvatarProps) {
  const radius = shape === "square" ? "rounded-lg" : "rounded-full";
  if (user.avatarUrl) {
    return (
      <Image src={user.avatarUrl} alt="" width={size} height={size} unoptimized className={`shrink-0 object-cover ${radius}`} style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center bg-sun font-black text-on-sun ${radius}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}
