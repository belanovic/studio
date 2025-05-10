
import type { SVGProps } from 'react';

export function KulturniKrugLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="80"
      height="80"
      aria-label="Културни Круг Лого"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', opacity: 0.8 }} />
        </linearGradient>
        <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="3" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#logoGradient)"
        filter="url(#dropShadow)"
      />
      <text
        x="50"
        y="58"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
        textAnchor="middle"
        stroke="hsl(var(--background))"
        strokeWidth="0.5"
        className="text-shadow-sm"
      >
        КК
      </text>
    </svg>
  );
}
