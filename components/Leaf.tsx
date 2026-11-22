/** Linden (lipa) leaf: heart-shaped, asymmetric base, serrated edge. Decorative. */
export function Leaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M100 214c-2-10-3-20-2-30C70 182 34 168 18 140 4 116 6 86 20 64c4 2 7 3 11 3-2-4-3-8-2-12 14-18 34-30 56-33 2 4 4 6 7 8 1-4 3-8 6-11 22 0 44 8 60 24-1 4-2 8-1 12 4-1 8-2 12-1 11 18 14 40 8 62-4-1-8-1-12 0 2 4 3 8 2 12-12 22-35 38-60 42-3 0-6 1-9 1 0 10 1 21 4 31z"
      />
      <path
        d="M100 210c-1-40 2-90 10-150M104 120c-18-10-40-12-62-8M106 95c16-14 36-20 58-20M103 150c-14-4-30-2-46 6M105 140c14-6 30-6 46 0"
        fill="none" stroke="var(--leaf-vein)" strokeWidth="3" strokeLinecap="round"
      />
    </svg>
  );
}
