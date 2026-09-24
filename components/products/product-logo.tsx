/**
 * product-logo.tsx
 * A product's uploaded logo, or a coloured monogram when it has none.
 */

import Image from "next/image";

const SIZES = { xs: 34, sm: 36, md: 44, row: 48, lg: 64, xl: 80 } as const;
const MONOGRAM_COLORS = ["#f2a33a", "#0284c7", "#7c3aed", "#ea580c", "#0d9488", "#db2777", "#ca8a04", "#4f46e5"];

interface ProductLogoProps {
  name: string;
  logoUrl: string | null;
  size?: keyof typeof SIZES;
}

export function ProductLogo({ name, logoUrl, size = "md" }: ProductLogoProps) {
  const px = SIZES[size];
  const box = "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dune-850";

  if (logoUrl) {
    return (
      <div className={`${box} bg-[#fff]`} style={{ width: px, height: px }}>
        {/* PocketBase serves the file directly; skip the Next optimizer for local/dev hosts. */}
        <Image src={logoUrl} alt={`${name} logo`} width={px} height={px} unoptimized className="h-full w-full object-contain" />
      </div>
    );
  }

  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (
    <div
      className={`${box} font-black text-[#fff]`}
      style={{ width: px, height: px, background: MONOGRAM_COLORS[hash % MONOGRAM_COLORS.length], fontSize: px * 0.4 }}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}
