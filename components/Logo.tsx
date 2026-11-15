function Footprint({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <g transform={mirrored ? "scale(-1 1) translate(-12 0)" : undefined}>
      <circle cx="9" cy="2.4" r="1.7" />
      <circle cx="6" cy="1.6" r="1.2" />
      <circle cx="3.7" cy="2.3" r="1" />
      <circle cx="1.9" cy="3.7" r="0.8" />
      <path d="M7 5.2c3 0 4.9 2.5 4.7 6-.2 3-1.6 4.7-2 7.4-.3 2.2.4 3.4-.4 5-.8 1.6-2.6 2.2-4.1 1.7-1.6-.5-2.3-2.1-2.1-4 .3-2.6 1.5-3.8.9-6.4C3.4 12.7 1.8 11.4 2.2 8.9 2.6 6.6 4.6 5.2 7 5.2z" />
    </g>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="sm-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff4d2e" />
          <stop offset="1" stopColor="#ff9a3c" />
        </linearGradient>
      </defs>
      <g fill="url(#sm-grad)">
        <g transform="translate(2 7) rotate(-14 6 12)">
          <Footprint />
        </g>
        <g transform="translate(17 2) rotate(14 6 12)" opacity="0.85">
          <Footprint mirrored />
        </g>
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="wordmark">
        Sole<span>Mate</span>
      </span>
    </span>
  );
}
