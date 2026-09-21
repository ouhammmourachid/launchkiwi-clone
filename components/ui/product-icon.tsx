/**
 * product-icon.tsx
 * Renders the icon for a product based on its iconType string.
 * This is the SINGLE source of truth for all product icons — do not
 * duplicate this switch statement in page files.
 */

interface ProductIconProps {
  type: string;
  /** Size variant — defaults to "md" (44×44 px). */
  size?: "sm" | "md";
}

export function ProductIcon({ type, size = "md" }: ProductIconProps) {
  const base =
    size === "sm"
      ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl";

  switch (type) {
    case "bear":
      return (
        <div className={`${base} bg-[#fffbeb] border border-[#fef3c7] shadow-sm`}>
          <span className="text-xl">🐻</span>
        </div>
      );
    case "linkedin":
      return (
        <div className={`${base} bg-[#0f172a] border border-[#334155] text-white`}>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </div>
      );
    case "coregulate":
      return (
        <div className={`${base} bg-gradient-to-tr from-[#f472b6] to-[#c084fc] border border-[#fbcfe8] text-white font-bold text-xs`}>
          <span className="text-lg">🌸</span>
        </div>
      );
    case "kwip":
      return (
        <div className={`${base} bg-[#ea580c] font-black text-white text-xs tracking-tighter`}>
          kwip
        </div>
      );
    case "blackhole":
      return (
        <div className={`${base} bg-[#18181b] border border-[#3f3f46]`}>
          <div className="h-5 w-5 rounded-full border-2 border-white/80 bg-black" />
        </div>
      );
    case "honeyfield":
      return (
        <div className={`${base} bg-[#7c3aed] text-white`}>
          <span className="text-base font-black">⬡</span>
        </div>
      );
    case "blocker":
      return (
        <div className={`${base} bg-[#0d9488] text-white`}>
          <span className="text-lg">🔘</span>
        </div>
      );
    case "mmw":
      return (
        <div className={`${base} bg-[#052e16] border border-[#14532d] font-black text-[#4ade80] text-xs`}>
          MMW
        </div>
      );
    case "cheapfax":
      return (
        <div className={`${base} bg-[#e2e8f0] text-slate-800`}>
          <span className="text-lg">📠</span>
        </div>
      );
    case "flightfinder":
      return (
        <div className={`${base} bg-[#0284c7] text-white`}>
          <span className="text-lg">✈️</span>
        </div>
      );
    case "jerncloud":
      return (
        <div className={`${base} bg-[#0f172a] border border-[#f97316]/50 text-[#f97316]`}>
          <span className="text-xl font-bold">»</span>
        </div>
      );
    case "u4ria":
      return (
        <div className={`${base} bg-[#042f2e] border border-[#115e59] text-[#2dd4bf]`}>
          <span className="text-lg">🧘</span>
        </div>
      );
    case "mirotalk":
      return (
        <div className={`${base} bg-black border border-white/20 text-white font-black text-[9px] text-center leading-tight`}>
          MiroTalk
        </div>
      );
    case "hostersale":
      return (
        <div className={`${base} bg-[#ffffff] border border-slate-300 text-slate-900 font-bold text-[9px] text-center`}>
          HosterSale
        </div>
      );
    case "melaya":
      return (
        <div className={`${base} bg-[#0f172a] border border-[#38bdf8] text-[#38bdf8]`}>
          <span className="text-lg">🧊</span>
        </div>
      );
    case "wordstoworlds":
      return (
        <div className={`${base} bg-[#15803d] text-white`}>
          <span className="text-lg">🌍</span>
        </div>
      );
    case "tavi":
      return (
        <div className={`${base} bg-[#14b8a6] text-white font-bold text-xl`}>
          t
        </div>
      );
    case "filexai":
      return (
        <div className={`${base} bg-[#0284c7] text-white`}>
          <span className="text-lg">📁</span>
        </div>
      );
    case "imaginode":
      return (
        <div className={`${base} bg-[#16a34a] text-white`}>
          <span className="text-lg">🔥</span>
        </div>
      );
    default:
      return (
        <div className={`${base} bg-[#86ba28] text-[#0a0d06] font-bold text-sm`}>
          LK
        </div>
      );
  }
}
