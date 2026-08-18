import { useId } from "react";
import type { ProgramVisualId } from "@/types/dashboard";

function uid(id: string, suffix: string) {
  return `${id}-${suffix}`;
}

export function HeroPlaceholder() {
  const id = useId().replace(/:/g, "");
  const sky = uid(id, "sky");
  const sun = uid(id, "sun");
  const bloom = uid(id, "bloom");
  const far = uid(id, "far");
  const mid = uid(id, "mid");
  const near = uid(id, "near");
  const ground = uid(id, "ground");
  const mist = uid(id, "mist");
  const leftWash = uid(id, "left");
  const blurFar = uid(id, "blur-far");
  const blurMid = uid(id, "blur-mid");
  const blurNear = uid(id, "blur-near");
  const blurFigure = uid(id, "blur-figure");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 960 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="1" y2="0.12">
          <stop offset="0%" stopColor="#f6f1e8" />
          <stop offset="22%" stopColor="#f3e6d4" />
          <stop offset="48%" stopColor="#efd0ae" />
          <stop offset="72%" stopColor="#e3b07a" />
          <stop offset="100%" stopColor="#c88854" />
        </linearGradient>
        <radialGradient id={sun} cx="82%" cy="38%" r="38%">
          <stop offset="0%" stopColor="#fff6e4" stopOpacity="0.95" />
          <stop offset="28%" stopColor="#f4d09a" stopOpacity="0.55" />
          <stop offset="62%" stopColor="#e0a468" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#e0a468" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={bloom} cx="78%" cy="46%" r="46%">
          <stop offset="0%" stopColor="#f7c989" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#f7c989" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={far} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c8a4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d4ae86" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={mid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a07a" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#a87b58" stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id={near} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8d684c" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#6a4a36" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id={ground} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c4030" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3f2c22" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={mist} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4e6d4" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f4e6d4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={leftWash} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f7f2ea" stopOpacity="0.72" />
          <stop offset="24%" stopColor="#f7f2ea" stopOpacity="0.38" />
          <stop offset="52%" stopColor="#f7f2ea" stopOpacity="0" />
        </linearGradient>
        <filter
          id={blurFar}
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
        >
          <feGaussianBlur stdDeviation="7.5" />
        </filter>
        <filter
          id={blurMid}
          x="-6%"
          y="-6%"
          width="112%"
          height="112%"
        >
          <feGaussianBlur stdDeviation="3.8" />
        </filter>
        <filter
          id={blurNear}
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
        >
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter
          id={blurFigure}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>

      <rect width="960" height="360" fill={`url(#${sky})`} />
      <rect width="960" height="360" fill={`url(#${sun})`} />
      <rect width="960" height="360" fill={`url(#${bloom})`} />

      <path
        d="M380 360 C470 214 540 236 610 198 C690 154 760 206 840 168 C900 142 940 168 960 184 V360 Z"
        fill={`url(#${far})`}
        filter={`url(#${blurFar})`}
      />
      <path
        d="M300 360 C410 236 500 268 590 214 C690 154 770 230 860 198 C920 178 950 204 960 220 V360 Z"
        fill={`url(#${mid})`}
        filter={`url(#${blurMid})`}
      />
      <path
        d="M210 360 C330 268 430 298 530 250 C640 196 730 268 840 244 C910 228 944 252 960 268 V360 Z"
        fill={`url(#${near})`}
        filter={`url(#${blurNear})`}
      />
      <path
        d="M0 360 C80 318 170 332 260 314 C380 292 470 326 580 318 C700 308 810 336 960 322 V360 Z"
        fill={`url(#${ground})`}
      />
      <rect width="960" height="360" fill={`url(#${mist})`} />
      <rect width="960" height="360" fill={`url(#${leftWash})`} />

      <g
        fill="#1c1612"
        opacity="0.78"
        filter={`url(#${blurFigure})`}
        transform="translate(18 8)"
      >
        <ellipse cx="792" cy="198" rx="15.5" ry="18.5" />
        <ellipse cx="798" cy="184" rx="7" ry="6.5" />
        <path d="M776 214 C774 238 780 258 792 262 C806 258 812 238 810 214 C804 218 798 220 792 220 C786 220 780 218 776 214 Z" />
        <path d="M764 218 C748 232 744 250 754 262 C770 256 782 258 792 260 C802 258 814 256 830 262 C840 250 836 232 820 218 C812 226 802 230 792 230 C782 230 772 226 764 218 Z" />
        <path d="M752 258 C744 272 748 286 768 290 C784 284 788 280 792 280 C796 280 800 284 816 290 C836 286 840 272 832 258 C818 268 804 272 792 272 C780 272 766 268 752 258 Z" />
      </g>
    </svg>
  );
}

export function ProgramPlaceholder({ visual }: { visual: ProgramVisualId }) {
  switch (visual) {
    case "feather":
      return <FeatherPlaceholder />;
    case "silhouette":
      return <SilhouettePlaceholder />;
    case "path":
      return <PathPlaceholder />;
    case "ripple":
      return <RipplePlaceholder />;
    case "moon":
      return <MoonPlaceholder />;
    case "calm":
      return <CalmPlaceholder />;
    case "glow":
      return <GlowPlaceholder />;
    case "journal":
      return <JournalPlaceholder />;
  }
}

function FeatherPlaceholder() {
  const id = useId().replace(/:/g, "");
  const glow = uid(id, "glow");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id={glow} cx="58%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f3ece3" />
          <stop offset="100%" stopColor="#e4d8c8" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${glow})`} />
      <g
        fill="none"
        stroke="#c4b6a4"
        strokeWidth="1.4"
        opacity="0.85"
        transform="translate(198 42) rotate(18)"
      >
        <path d="M0 8 C18 40 22 90 8 196 C2 230 -6 252 0 276" />
        <path d="M0 36 C-28 70 -36 110 -18 150" />
        <path d="M2 70 C32 96 40 132 22 168" />
        <path d="M0 108 C-24 132 -26 162 -10 190" />
        <path d="M2 140 C24 158 26 184 12 208" />
        <path d="M1 176 C-16 192 -14 214 -4 230" />
      </g>
    </svg>
  );
}

function SilhouettePlaceholder() {
  const id = useId().replace(/:/g, "");
  const sky = uid(id, "sky");
  const ground = uid(id, "ground");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d3a4" />
          <stop offset="45%" stopColor="#e39a62" />
          <stop offset="100%" stopColor="#b45d3a" />
        </linearGradient>
        <linearGradient id={ground} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a241c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2a1b14" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${sky})`} />
      <circle cx="268" cy="92" r="54" fill="#fff1d4" opacity="0.45" />
      <rect y="210" width="400" height="90" fill={`url(#${ground})`} />
      <path
        d="M200 168 C196 150 204 136 214 128 C206 118 214 108 226 112 C232 96 248 90 258 108 C270 102 280 114 274 128 C288 136 292 154 284 168 C304 176 318 198 300 214 L226 214 C208 198 196 180 200 168 Z"
        fill="#2c211c"
        opacity="0.55"
      />
    </svg>
  );
}

function PathPlaceholder() {
  const id = useId().replace(/:/g, "");
  const sky = uid(id, "sky");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8e4c4" />
          <stop offset="50%" stopColor="#e8b57a" />
          <stop offset="100%" stopColor="#c98452" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${sky})`} />
      <circle cx="300" cy="78" r="46" fill="#fff3d8" opacity="0.5" />
      <path d="M0 168 L90 96 L150 138 L210 72 L290 128 L360 84 L400 118 V300 H0 Z" fill="#d7ae82" opacity="0.7" />
      <path d="M0 210 L70 150 L140 188 L220 132 L310 176 L400 140 V300 H0 Z" fill="#b88860" opacity="0.72" />
      <path
        d="M0 300 C80 250 120 268 180 240 C250 206 280 250 400 220 V300 Z"
        fill="#8d6548"
        opacity="0.78"
      />
      <path
        d="M168 300 C176 270 196 252 206 228 C216 204 206 186 224 168"
        fill="none"
        stroke="#f0e2d0"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function RipplePlaceholder() {
  const id = useId().replace(/:/g, "");
  const water = uid(id, "water");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={water} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#24344f" />
          <stop offset="100%" stopColor="#152033" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${water})`} />
      <g fill="none" stroke="#d7c4aa" strokeOpacity="0.28">
        <ellipse cx="210" cy="150" rx="36" ry="16" strokeWidth="1.5" />
        <ellipse cx="210" cy="150" rx="68" ry="30" strokeWidth="1.25" />
        <ellipse cx="210" cy="150" rx="104" ry="46" strokeWidth="1.1" />
        <ellipse cx="210" cy="150" rx="142" ry="64" strokeWidth="1" />
        <ellipse cx="210" cy="150" rx="184" ry="84" strokeWidth="0.9" />
      </g>
    </svg>
  );
}

function MoonPlaceholder() {
  const id = useId().replace(/:/g, "");
  const sky = uid(id, "sky");
  const moonGlow = uid(id, "moon-glow");
  const hill = uid(id, "hill");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 480 270"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#3a2a22" />
          <stop offset="48%" stopColor="#241910" />
          <stop offset="100%" stopColor="#16100c" />
        </linearGradient>
        <radialGradient id={moonGlow} cx="74%" cy="30%" r="42%">
          <stop offset="0%" stopColor="#f4e0b8" stopOpacity="0.7" />
          <stop offset="36%" stopColor="#c4a07a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c4a07a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={hill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1c14" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#120e0a" stopOpacity="0.92" />
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${sky})`} />
      <rect width="480" height="270" fill={`url(#${moonGlow})`} />
      <circle cx="352" cy="78" r="38" fill="#f6ead0" opacity="0.92" />
      <circle cx="338" cy="70" r="12" fill="#e8d2a8" opacity="0.28" />
      <g fill="#f4e6c8" opacity="0.42">
        <circle cx="56" cy="42" r="1.4" />
        <circle cx="98" cy="68" r="1.1" />
        <circle cx="148" cy="32" r="1.3" />
        <circle cx="206" cy="86" r="0.9" />
        <circle cx="248" cy="48" r="1.15" />
        <circle cx="430" cy="36" r="1.2" />
        <circle cx="412" cy="118" r="1" />
      </g>
      <path
        d="M0 270 C54 214 118 230 176 204 C248 172 304 210 368 188 C420 172 452 196 480 186 V270 Z"
        fill={`url(#${hill})`}
      />
      <path
        d="M0 270 C80 236 140 248 210 228 C286 206 340 242 480 224 V270 Z"
        fill="#120e0a"
        opacity="0.72"
      />
    </svg>
  );
}

function CalmPlaceholder() {
  const id = useId().replace(/:/g, "");
  const water = uid(id, "water");
  const bloom = uid(id, "bloom");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 480 270"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={water} x1="0" y1="0" x2="0.12" y2="1">
          <stop offset="0%" stopColor="#d8e6ea" />
          <stop offset="42%" stopColor="#7ea3b0" />
          <stop offset="100%" stopColor="#3d5f68" />
        </linearGradient>
        <radialGradient id={bloom} cx="50%" cy="46%" r="34%">
          <stop offset="0%" stopColor="#f7f2ea" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f7f2ea" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${water})`} />
      <rect width="480" height="270" fill={`url(#${bloom})`} />
      <g fill="none" stroke="#f4eee4" strokeOpacity="0.38">
        <ellipse cx="240" cy="168" rx="42" ry="12" strokeWidth="1.2" />
        <ellipse cx="240" cy="168" rx="78" ry="22" strokeWidth="1.1" />
        <ellipse cx="240" cy="168" rx="122" ry="34" strokeWidth="1" />
        <ellipse cx="240" cy="168" rx="172" ry="48" strokeWidth="0.9" />
      </g>
      <g transform="translate(240 118)" fill="#efe4d4" opacity="0.9">
        <ellipse cx="0" cy="-22" rx="16" ry="28" />
        <ellipse cx="-22" cy="-8" rx="15" ry="26" transform="rotate(-36)" />
        <ellipse cx="22" cy="-8" rx="15" ry="26" transform="rotate(36)" />
        <ellipse cx="-18" cy="12" rx="14" ry="24" transform="rotate(-70)" />
        <ellipse cx="18" cy="12" rx="14" ry="24" transform="rotate(70)" />
        <circle cx="0" cy="2" r="9" fill="#c4a07a" />
      </g>
      <path
        d="M240 128 C238 150 236 168 236 186"
        fill="none"
        stroke="#d7c4aa"
        strokeWidth="1.4"
        opacity="0.55"
      />
    </svg>
  );
}

function GlowPlaceholder() {
  const id = useId().replace(/:/g, "");
  const sky = uid(id, "sky");
  const bloom = uid(id, "bloom");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 480 270"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stopColor="#f8edd8" />
          <stop offset="42%" stopColor="#e8c08a" />
          <stop offset="100%" stopColor="#c48a58" />
        </linearGradient>
        <radialGradient id={bloom} cx="58%" cy="38%" r="46%">
          <stop offset="0%" stopColor="#fff6e4" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f0d0a0" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#f0d0a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${sky})`} />
      <rect width="480" height="270" fill={`url(#${bloom})`} />
      <circle cx="278" cy="96" r="34" fill="#fff3d2" opacity="0.55" />
      <g
        fill="none"
        stroke="#a67c52"
        strokeWidth="1.45"
        opacity="0.78"
        transform="translate(214 28) rotate(16)"
      >
        <path d="M0 8 C18 40 22 90 8 176 C2 208 -6 228 0 248" />
        <path d="M0 32 C-28 64 -36 102 -18 140" />
        <path d="M2 64 C32 90 40 124 22 158" />
        <path d="M0 98 C-24 122 -26 150 -10 176" />
        <path d="M2 128 C24 146 26 170 12 192" />
        <path d="M1 160 C-16 176 -14 196 -4 212" />
      </g>
    </svg>
  );
}

function JournalPlaceholder() {
  const id = useId().replace(/:/g, "");
  const room = uid(id, "room");
  const table = uid(id, "table");
  const flame = uid(id, "flame");
  const page = uid(id, "page");

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 480 270"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={room} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#3a2a20" />
          <stop offset="100%" stopColor="#1c1410" />
        </linearGradient>
        <linearGradient id={table} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a4a32" />
          <stop offset="100%" stopColor="#3d2a1c" />
        </linearGradient>
        <radialGradient id={flame} cx="70%" cy="38%" r="34%">
          <stop offset="0%" stopColor="#ffe7b0" stopOpacity="0.85" />
          <stop offset="46%" stopColor="#c4a07a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#c4a07a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={page} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7f1e4" />
          <stop offset="100%" stopColor="#e4d4bc" />
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${room})`} />
      <rect width="480" height="270" fill={`url(#${flame})`} />
      <path d="M0 176 L480 148 V270 H0 Z" fill={`url(#${table})`} />
      <g transform="translate(92 112) rotate(-8)">
        <rect width="168" height="108" rx="4" fill={`url(#${page})`} />
        <rect x="84" width="84" height="108" rx="3" fill="#efe4d0" />
        <g stroke="#cbbca8" strokeWidth="1.2" opacity="0.7">
          <line x1="18" y1="28" x2="72" y2="28" />
          <line x1="18" y1="44" x2="68" y2="44" />
          <line x1="18" y1="60" x2="70" y2="60" />
          <line x1="98" y1="28" x2="150" y2="28" />
          <line x1="98" y1="44" x2="146" y2="44" />
          <line x1="98" y1="60" x2="142" y2="60" />
        </g>
      </g>
      <g transform="translate(318 86)">
        <rect x="10" y="52" width="28" height="46" rx="3" fill="#d8c4a4" />
        <path d="M24 18 C16 34 18 46 24 54 C30 46 32 34 24 18 Z" fill="#f3c56a" />
        <ellipse cx="24" cy="20" rx="5" ry="8" fill="#fff4d2" opacity="0.9" />
      </g>
    </svg>
  );
}
