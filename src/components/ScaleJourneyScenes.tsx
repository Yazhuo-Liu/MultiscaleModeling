import { memo } from "react";

export type JourneyStageId =
  "object" | "crack" | "grains" | "dislocations" | "atoms";

/** A 600 × 360 view. Each selection has the same aspect ratio as the next view. */
export const JOURNEY_TARGETS: Record<
  JourneyStageId,
  { cx: number; cy: number; width: number }
> = {
  object: { cx: 344, cy: 166, width: 130 },
  crack: { cx: 425, cy: 180, width: 128 },
  grains: { cx: 315, cy: 180, width: 112 },
  dislocations: { cx: 315, cy: 180, width: 130 },
  atoms: { cx: 315, cy: 180, width: 130 },
};

const color = {
  background: "var(--journey-bg, #f6f9f8)",
  light: "var(--journey-light, #ffffff)",
  ink: "var(--journey-ink, #354e53)",
  line: "var(--journey-line, #b9ccca)",
  metal: "var(--journey-metal, #bfd1d0)",
  metalDark: "var(--journey-metal-dark, #7f9c9f)",
  teal: "var(--journey-teal, #5c9189)",
  tealLight: "var(--journey-teal-light, #dbe9e4)",
  purple: "var(--journey-purple, #9782bd)",
  purpleDark: "var(--journey-purple-dark, #705b99)",
  purpleLight: "var(--journey-purple-light, #eae3f2)",
  warm: "var(--journey-warm, #c38d65)",
  warmLight: "var(--journey-warm-light, #eee6d6)",
};

type Point = readonly [number, number];
const grainSeeds: Point[] = [
  [-10, -10],
  [95, 20],
  [190, 0],
  [305, -20],
  [420, 8],
  [560, 10],
  [625, 80],
  [24, 112],
  [132, 104],
  [220, 50],
  [405, 76],
  [508, 111],
  [598, 160],
  [-20, 242],
  [89, 210],
  [140, 180],
  [315, 180],
  [450, 185],
  [557, 258],
  [18, 340],
  [112, 328],
  [200, 310],
  [318, 350],
  [421, 303],
  [519, 370],
  [620, 348],
];

/** Deterministic Voronoi cells, clipped by each perpendicular bisector. */
function voronoiCell(seed: Point): Point[] {
  let polygon: Point[] = [
    [-25, -25],
    [625, -25],
    [625, 385],
    [-25, 385],
  ];
  for (const other of grainSeeds) {
    if (other === seed) continue;
    const nx = other[0] - seed[0];
    const ny = other[1] - seed[1];
    const limit =
      (other[0] ** 2 + other[1] ** 2 - seed[0] ** 2 - seed[1] ** 2) / 2;
    const clipped: Point[] = [];
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = nx * a[0] + ny * a[1] - limit;
      const db = nx * b[0] + ny * b[1] - limit;
      if (da <= 1e-8) clipped.push(a);
      if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
        const fraction = da / (da - db);
        clipped.push([
          a[0] + fraction * (b[0] - a[0]),
          a[1] + fraction * (b[1] - a[1]),
        ]);
      }
    }
    polygon = clipped;
    if (!polygon.length) break;
  }
  return polygon;
}

const grains = grainSeeds.map((seed, index) => ({
  seed,
  points: voronoiCell(seed)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" "),
  angle: [-38, 15, 67, -12, 36, 82, -59][index % 7],
}));
const grainColors = [
  color.tealLight,
  color.purpleLight,
  color.warmLight,
  color.background,
  color.metal,
];

const atoms = Array.from({ length: 7 }, (_, row) => row - 3).flatMap((j) =>
  Array.from({ length: 13 }, (_, column) => column - 6)
    .filter((i) => j <= 0 || i !== 0)
    .map((i) => {
      // An idealized extra half-plane ends at (i,j)=(0,0). Below it,
      // the two halves relax toward a row with one fewer lattice site.
      const shift = j > 0 ? (-Math.sign(i) * 17 * Math.min(j, 2)) / 2 : 0;
      const bend = 5 * Math.exp(-Math.abs(i) / 1.5) * Math.tanh(-j);
      return { i, j, x: 315 + i * 34 + shift, y: 180 + j * 38 + bend };
    }),
);
const atomByIndex = new Map(atoms.map((atom) => [`${atom.i},${atom.j}`, atom]));

function MetalObject({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor={color.light} />
          <stop offset=".44" stopColor={color.metal} />
          <stop offset=".74" stopColor={color.tealLight} />
          <stop offset="1" stopColor={color.metalDark} />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color.metalDark} />
          <stop offset="1" stopColor={color.metal} />
        </linearGradient>
        <linearGradient id={`${id}-hole`} x1="0" y1="0" x2=".3" y2="1">
          <stop offset="0" stopColor={color.ink} />
          <stop offset="1" stopColor={color.metalDark} />
        </linearGradient>
        <clipPath id={`${id}-surface`}>
          <path d="M90 115 448 65 523 160 165 212Z" />
        </clipPath>
      </defs>
      <ellipse
        cx="320"
        cy="266"
        rx="217"
        ry="28"
        fill={color.metalDark}
        opacity=".09"
      />
      <path
        d="M90 115 165 212V261L90 164Z"
        fill={color.metalDark}
        stroke={color.metalDark}
        strokeWidth="1.5"
      />
      <path
        d="M165 212 523 160V209L165 261Z"
        fill={`url(#${id}-front)`}
        stroke={color.metalDark}
        strokeWidth="1.5"
      />
      <path
        d="M90 115 448 65 523 160 165 212Z"
        fill={`url(#${id}-top)`}
        stroke={color.metalDark}
        strokeWidth="1.5"
      />
      <g clipPath={`url(#${id}-surface)`} stroke={color.light} opacity=".25">
        {Array.from({ length: 23 }, (_, i) => (
          <path key={i} d={`M48 ${100 + i * 6}l520 -73`} strokeWidth=".8" />
        ))}
      </g>
      <path
        d="M94 116 448 68 519 159M168 215 519 164"
        fill="none"
        stroke={color.light}
        strokeWidth="2"
        opacity=".64"
      />
      {[
        [185, 141],
        [429, 108],
      ].map(([x, y]) => (
        <g key={x}>
          <ellipse
            cx={x}
            cy={y}
            rx="25"
            ry="15"
            fill={color.light}
            opacity=".68"
          />
          <ellipse
            cx={x}
            cy={y + 1}
            rx="21"
            ry="12"
            fill={`url(#${id}-hole)`}
          />
          <path
            d={`M${x - 19} ${y + 5}q19 12 38 -2`}
            fill="none"
            stroke={color.metalDark}
            strokeWidth="3"
          />
        </g>
      ))}
      <path
        d="M310 191 319 181 329 180 337 172 345 174 355 166 348 174 338 177 331 185 321 185 315 195Z"
        fill={color.ink}
        opacity=".88"
      />
      <path
        d="m310 191 9-10 10-1 8-8 8 2 10-8"
        fill="none"
        stroke={color.light}
        strokeWidth="1.1"
        opacity=".85"
      />
      <path
        d="M165 261 523 209"
        fill="none"
        stroke={color.metalDark}
        strokeWidth="2"
      />
      <g stroke={color.line} strokeWidth="1" fill="none" opacity=".7">
        <path d="M95 285 509 228M95 279v12m414-69v12" />
        <path d="M74 123v49m-5-47h10m-10 45h10" />
      </g>
    </>
  );
}

function Crack({ id }: { id: string }) {
  const crack =
    "M-20 162 44 168 88 161 132 171 181 164 219 174 258 171 292 178 320 175 350 180 321 184 291 190 263 188 224 200 185 198 138 218 92 215 41 239-61 251Z";
  return (
    <>
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color.tealLight} />
          <stop offset=".5" stopColor={color.background} />
          <stop offset="1" stopColor={color.metal} />
        </linearGradient>
        <linearGradient id={`${id}-void`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color.ink} />
          <stop offset="1" stopColor={color.metalDark} />
        </linearGradient>
        <clipPath id={`${id}-opening`}>
          <path d={crack} />
        </clipPath>
      </defs>
      <rect width="600" height="360" fill={`url(#${id}-metal)`} />
      <g stroke={color.metalDark} opacity=".12" strokeWidth=".7">
        {Array.from({ length: 29 }, (_, i) => (
          <path key={i} d={`M0 ${i * 13 + 2} 600 ${i * 13 - 34}`} />
        ))}
      </g>
      <path d={crack} fill={`url(#${id}-void)`} />
      <g
        clipPath={`url(#${id}-opening)`}
        stroke={color.ink}
        opacity=".45"
        strokeWidth="2"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`m${i * 30} 151 28 101`} />
        ))}
      </g>
      <path
        d="M-20 161 44 167 88 160 132 170 181 163 219 173 258 170 292 177 320 174 350 180"
        fill="none"
        stroke={color.light}
        strokeWidth="3"
        opacity=".9"
      />
      <path
        d="M350 180 321 184 291 190 263 188 224 200 185 198 138 218 92 215 41 239-61 251"
        fill="none"
        stroke={color.metalDark}
        strokeWidth="2.5"
      />
      <path
        d="M351 178q32-31 61-22m-57 26q30 30 55 25"
        stroke={color.teal}
        strokeWidth="1.3"
        strokeDasharray="4 6"
        opacity=".28"
        fill="none"
      />
      <circle cx="350" cy="180" r="4" fill={color.ink} />
      <g opacity=".24" stroke={color.teal} strokeWidth="1" fill="none">
        <path d="m390 138 29-14 35 16 5 32-23 21-36-13Z" />
        <path d="m400 180-16 31 22 30 35-3 14-36-19-9m23-21 30-10 27 24-9 34-52-18" />
      </g>
    </>
  );
}

function Grains({ id }: { id: string }) {
  return (
    <>
      <defs>
        {grains.map((grain, i) => (
          <pattern
            key={i}
            id={`${id}-hatch-${i}`}
            width="13"
            height="13"
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${grain.angle})`}
          >
            <path
              d="M0 0V13"
              stroke={color.metalDark}
              strokeWidth="1"
              opacity=".35"
            />
          </pattern>
        ))}
      </defs>
      {grains.map((grain, i) => (
        <g key={i}>
          <polygon
            points={grain.points}
            fill={
              i === 16 ? color.purpleLight : grainColors[i % grainColors.length]
            }
            stroke={color.light}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <polygon points={grain.points} fill={`url(#${id}-hatch-${i})`} />
          <polygon
            points={grain.points}
            fill="none"
            stroke={color.line}
            strokeWidth=".8"
            strokeLinejoin="round"
          />
          <g
            transform={`translate(${grain.seed[0]},${grain.seed[1]}) rotate(${grain.angle})`}
            opacity={i === 16 ? ".65" : ".32"}
            stroke={i === 16 ? color.purpleDark : color.teal}
            strokeWidth="1.7"
          >
            <path d="M-12 0H12m-5-4 5 4-5 4" fill="none" />
          </g>
        </g>
      ))}
      <polygon
        points={grains[16].points}
        fill="none"
        stroke={color.purple}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M268 188q22-19 47-8t47-12"
        fill="none"
        stroke={color.purpleDark}
        strokeWidth="2.8"
        opacity=".65"
      />
      <path
        d="m278 206 65-43m-51 58 65-43"
        stroke={color.purple}
        strokeWidth="1"
        opacity=".2"
      />
    </>
  );
}

function Dislocations({ id }: { id: string }) {
  const plane = "M70 70 484 40 548 277 137 315Z";
  return (
    <>
      <defs>
        <linearGradient id={`${id}-plane`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color.light} />
          <stop offset=".52" stopColor={color.purpleLight} />
          <stop offset="1" stopColor={color.tealLight} />
        </linearGradient>
        <clipPath id={`${id}-inside`}>
          <path d={plane} />
        </clipPath>
      </defs>
      <path
        d="M70 70 137 315v9L70 79Zm67 245 411-38v9l-411 38Z"
        fill={color.metal}
        opacity=".65"
      />
      <path
        d={plane}
        fill={`url(#${id}-plane)`}
        stroke={color.line}
        strokeWidth="1.5"
      />
      <g clipPath={`url(#${id}-inside)`}>
        <g stroke={color.purple} strokeWidth="1" opacity=".16">
          {Array.from({ length: 23 }, (_, i) => (
            <path key={i} d={`M0 ${i * 18} 600 ${i * 18 - 51}`} />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <path key={i} d={`M${i * 26} 0l100 360`} />
          ))}
        </g>
        <path
          d="M40 128C137 27 235 172 315 180S454 94 590 135"
          fill="none"
          stroke={color.light}
          strokeWidth="9"
          opacity=".8"
        />
        <path
          d="M40 128C137 27 235 172 315 180S454 94 590 135"
          fill="none"
          stroke={color.purpleDark}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M50 241C185 115 212 281 340 263S472 216 590 276"
          fill="none"
          stroke={color.teal}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M105 365C244 235 322 348 470 295S540 275 613 314"
          fill="none"
          stroke={color.warm}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M42 55C155 116 187 39 272 64S392 42 480-12"
          fill="none"
          stroke={color.purple}
          strokeWidth="2.8"
          opacity=".7"
        />
      </g>
      <circle
        cx="315"
        cy="180"
        r="18"
        fill={color.light}
        fillOpacity=".35"
        stroke={color.purple}
        strokeWidth="1"
      />
      <circle
        cx="315"
        cy="180"
        r="5.5"
        fill={color.purpleDark}
        stroke={color.light}
        strokeWidth="2"
      />
      <path
        d="M70 70 484 40"
        stroke={color.light}
        strokeWidth="2"
        opacity=".8"
      />
    </>
  );
}

function Atoms({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-atom`} cx="32%" cy="27%" r="72%">
          <stop offset="0" stopColor={color.light} />
          <stop offset=".45" stopColor={color.metal} />
          <stop offset="1" stopColor={color.teal} />
        </radialGradient>
        <radialGradient id={`${id}-extra`} cx="32%" cy="27%" r="72%">
          <stop offset="0" stopColor={color.light} />
          <stop offset=".45" stopColor={color.purpleLight} />
          <stop offset="1" stopColor={color.purpleDark} />
        </radialGradient>
        <radialGradient id={`${id}-core`}>
          <stop offset="0" stopColor={color.purpleLight} stopOpacity=".8" />
          <stop offset="1" stopColor={color.purpleLight} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="315" cy="180" rx="124" ry="128" fill={`url(#${id}-core)`} />
      <g stroke={color.line} strokeWidth="1.9" opacity=".8">
        {atoms.flatMap((atom) => {
          const right =
            atomByIndex.get(`${atom.i + 1},${atom.j}`) ||
            (atom.j > 0 && atom.i === -1
              ? atomByIndex.get(`1,${atom.j}`)
              : undefined);
          const down = atomByIndex.get(`${atom.i},${atom.j + 1}`);
          return [right, down]
            .filter((next) => next !== undefined)
            .map((next, index) => (
              <line
                key={`${atom.i},${atom.j},${index}`}
                x1={atom.x}
                y1={atom.y}
                x2={next.x}
                y2={next.y}
              />
            ));
        })}
      </g>
      <path
        d="M315 69V180"
        fill="none"
        stroke={color.purple}
        strokeWidth="17"
        opacity=".1"
        strokeLinecap="round"
      />
      <path
        d="M92 198H540"
        stroke={color.purple}
        strokeWidth="1.2"
        strokeDasharray="5 6"
        opacity=".32"
      />
      {atoms.map((atom) => (
        <g key={`${atom.i},${atom.j}`}>
          <ellipse
            cx={atom.x + 1.5}
            cy={atom.y + 7}
            rx="10"
            ry="5"
            fill={color.metalDark}
            opacity=".1"
          />
          <circle
            cx={atom.x}
            cy={atom.y}
            r={atom.i === 0 && atom.j === 0 ? 12 : 10.5}
            fill={`url(#${id}-${atom.i === 0 && atom.j <= 0 ? "extra" : "atom"})`}
            stroke={
              atom.i === 0 && atom.j <= 0 ? color.purple : color.metalDark
            }
            strokeWidth=".55"
          />
        </g>
      ))}
      <circle
        cx="315"
        cy="180"
        r="21"
        fill="none"
        stroke={color.purple}
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity=".75"
      />
    </>
  );
}

/** Geometric artwork only: the parent supplies labels, camera and controls. */
export const ScaleJourneyScene = memo(function ScaleJourneyScene({
  stage,
  prefix,
}: {
  stage: JourneyStageId;
  prefix: string;
}) {
  const id = `${prefix}-${stage}`;
  return (
    <g data-journey-scene={stage} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-bounds`}>
          <rect width="600" height="360" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-bounds)`}>
        <rect width="600" height="360" fill={color.background} />
        {stage === "object" ? (
          <MetalObject id={id} />
        ) : stage === "crack" ? (
          <Crack id={id} />
        ) : stage === "grains" ? (
          <Grains id={id} />
        ) : stage === "dislocations" ? (
          <Dislocations id={id} />
        ) : (
          <Atoms id={id} />
        )}
      </g>
    </g>
  );
});
