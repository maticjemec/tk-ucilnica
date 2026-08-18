import { Heart } from "lucide-react";

const glowPaths = [
  "M-24 112 C 36 94, 72 132, 124 108 C 172 86, 206 124, 268 102",
  "M-20 124 C 40 112, 84 142, 136 122 C 184 104, 218 136, 268 118",
  "M-18 98 C 48 78, 92 126, 148 94 C 192 70, 224 114, 268 88",
];

const flowPaths = [
  {
    d: "M-22 116 C 34 96, 70 136, 122 112 C 168 90, 204 128, 266 106",
    width: 2.1,
    opacity: 0.55,
    color: "#c4a07a",
  },
  {
    d: "M-18 128 C 42 116, 86 146, 138 126 C 182 108, 216 140, 266 122",
    width: 1.8,
    opacity: 0.42,
    color: "#a67c52",
  },
  {
    d: "M-16 104 C 50 82, 94 128, 150 98 C 194 74, 226 116, 266 92",
    width: 1.7,
    opacity: 0.38,
    color: "#d4b896",
  },
  {
    d: "M-14 136 C 46 126, 90 152, 144 134 C 188 118, 222 148, 266 132",
    width: 2.4,
    opacity: 0.34,
    color: "#a67c52",
  },
  {
    d: "M-10 144 C 54 136, 98 158, 156 142 C 198 130, 230 154, 266 144",
    width: 1.9,
    opacity: 0.26,
    color: "#c4a07a",
  },
];

const trailPaths = [
  {
    d: "M-8 120 C 38 102, 76 134, 126 114 C 170 96, 208 126, 264 110",
    width: 1.35,
    opacity: 0.5,
    color: "#e0c9a8",
  },
  {
    d: "M12 140 C 58 128, 96 150, 148 134 C 190 120, 226 144, 262 134",
    width: 1.2,
    opacity: 0.32,
    color: "#c4a07a",
  },
  {
    d: "M28 132 C 62 108, 92 86, 118 70",
    width: 1.45,
    opacity: 0.28,
    color: "#d4b896",
  },
  {
    d: "M212 132 C 178 108, 148 86, 122 70",
    width: 1.45,
    opacity: 0.28,
    color: "#d4b896",
  },
  {
    d: "M86 148 C 102 128, 92 108, 108 88",
    width: 1.15,
    opacity: 0.2,
    color: "#c4a07a",
  },
  {
    d: "M154 148 C 138 128, 150 108, 132 88",
    width: 1.15,
    opacity: 0.2,
    color: "#c4a07a",
  },
];

function WaveLayer({
  paths,
  blur,
  opacity = 1,
}: {
  paths: Array<{ d: string; width: number; opacity: number; color: string }>;
  blur: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 240 150"
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 h-full w-full"
      style={{ filter: `blur(${blur})`, opacity }}
      fill="none"
      aria-hidden="true"
    >
      {paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          opacity={path.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function SidebarQuote() {
  return (
    <div className="relative flex h-[clamp(12.5rem,34svh,16.25rem)] w-full shrink-0 flex-col items-center overflow-hidden rounded-md border border-[rgba(196,160,122,0.28)] bg-sidebar-elevated px-5 pt-9">
      <p className="relative z-10 max-w-[11.5rem] text-center font-serif text-[0.98rem] leading-[1.5] text-[#ead9c0]">
        Spremeni svoje misli
        <br />
        in spremenil se bo
        <br />
        tvoj svet.
      </p>

      <Heart
        aria-hidden="true"
        className="relative z-10 mt-8 h-5 w-5 text-accent-soft"
        strokeWidth={1.5}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] [mask-image:linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.82)_28%,rgba(0,0,0,0.35)_62%,transparent_92%)]"
      >
        <div className="absolute inset-x-[-10%] bottom-[-18%] h-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(166,124,82,0.22),transparent_72%)]" />

        <WaveLayer
          blur="7px"
          opacity={0.55}
          paths={glowPaths.map((d) => ({
            d,
            width: 7,
            opacity: 0.45,
            color: "#c4a07a",
          }))}
        />
        <WaveLayer blur="2.4px" paths={flowPaths} />
        <WaveLayer blur="0.55px" paths={trailPaths} />
      </div>
    </div>
  );
}
