/**
 * section-header.tsx
 * The green-dot + title + right-side label header used at the top of
 * every product-list section card.
 */

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-dune-850 px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-sun" />
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">{title}</h2>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-dune-500">
        {subtitle}
      </span>
    </div>
  );
}
