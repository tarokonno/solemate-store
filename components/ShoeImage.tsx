import Image from "next/image";

export function ShoeImage({ name, color, src, small = false }: { name: string; color: string; src?: string; small?: boolean }) {
  return (
    <div className={small ? "shoe-image small" : "shoe-image"} style={{ background: `${color}14` }}>
      {src ? (
        <Image src={src} alt={name} fill sizes={small ? "72px" : "(max-width: 640px) 100vw, 320px"} />
      ) : (
        <svg viewBox="0 0 240 120" role="img" aria-label={name}>
          <path
            d="M30 84c-3-18 3-36 16-44 8-5 14-6 20-2 8 6 16 14 30 16 16 2 30-4 44-2 24 3 56 14 74 28z"
            fill={color}
          />
          <path d="M84 50l8 10M98 54l7 9M112 54l5 9" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 70c30-6 70 4 110 2" stroke="#fff" strokeOpacity=".35" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M18 92c0-8 8-12 18-12h160c16 0 30 6 32 16 1 6-4 10-12 10H34c-10 0-16-6-16-14z" fill="#fff" stroke="#00000014" />
          <rect x="24" y="103" width="198" height="7" rx="3.5" fill="#1c1c1c" opacity=".85" />
        </svg>
      )}
    </div>
  );
}
