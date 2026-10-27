import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Focus, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useLanguage } from "../i18n";
import {
  JOURNEY_TARGETS,
  ScaleJourneyScene,
  type JourneyStageId,
} from "./ScaleJourneyScenes";

const STAGES: {
  id: JourneyStageId;
  short: [string, string];
  title: [string, string];
  caption: [string, string];
  scale: string;
  focus: [string, string];
}[] = [
  {
    id: "object",
    short: ["构件", "Object"],
    title: ["从一块金属开始", "Start with a metal specimen"],
    caption: [
      "宏观上是一件承载的物体。沿着局部裂纹，走进材料内部。",
      "A load-bearing object at first glance. Follow a local crack into the material.",
    ],
    scale: "≈ 10 cm",
    focus: ["看裂纹", "See the crack"],
  },
  {
    id: "crack",
    short: ["裂纹", "Crack"],
    title: ["裂纹尖端，还有什么？", "What lies ahead of a crack?"],
    caption: [
      "裂纹形成开口；裂尖前方的完整材料中，隐藏着更细的结构。",
      "The crack has an opening. Intact material ahead of its tip contains finer structure.",
    ],
    scale: "≈ 1 mm",
    focus: ["看晶粒", "See the grains"],
  },
  {
    id: "grains",
    short: ["晶粒", "Grains"],
    title: ["晶粒拼成了这块金属", "Grains make up the metal"],
    caption: [
      "晶界分隔不同取向的晶粒。选中一个晶粒，继续向内部放大。",
      "Grain boundaries separate differently oriented crystals. Look inside one grain.",
    ],
    scale: "≈ 20 μm",
    focus: ["看位错", "See dislocations"],
  },
  {
    id: "dislocations",
    short: ["位错", "Defects"],
    title: ["晶体内部的线缺陷", "Line defects inside a crystal"],
    caption: [
      "位错参与塑性滑移。选中一段位错线，观察核心附近的局部横截面。",
      "Dislocations participate in plastic slip. Inspect a local cross-section near a selected core.",
    ],
    scale: "≈ 200 nm",
    focus: ["看原子", "See the atoms"],
  },
  {
    id: "atoms",
    short: ["原子", "Atoms"],
    title: ["最后，来到原子的排列", "Finally, the atomic arrangement"],
    caption: [
      "理想化横截面：紫色高亮额外半原子面，终止处是刃型位错核心。",
      "An idealized section: purple highlights an extra half-plane ending at an edge-dislocation core.",
    ],
    scale: "≈ 3 nm",
    focus: ["", ""],
  },
];
const LAST = STAGES.length - 1;
const HOLD_MS = 2400;
const ZOOM_MS = 1250;
const clamp = (value: number) => Math.max(0, Math.min(LAST, value));
const smooth = (t: number) => t * t * (3 - 2 * t);
type Motion = { from: number; to: number; elapsed: number; duration: number };

export default function ScaleJourney() {
  const { t } = useLanguage();
  const id = useId().replace(/:/g, "");
  const host = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const [playing, setPlaying] = useState(
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const playingRef = useRef(playing);
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(() => !document.hidden);
  const [revision, wake] = useState(0);
  const motion = useRef<Motion | null>(null);
  const hold = useRef(0);
  const putPosition = useCallback((value: number) => {
    positionRef.current = clamp(value);
    setPosition(positionRef.current);
  }, []);
  const setPlayback = useCallback((value: boolean) => {
    playingRef.current = value;
    setPlaying(value);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2] },
    );
    if (host.current) observer.observe(host.current);
    const visibility = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        motion.current = null;
        hold.current = 0;
        setPlayback(false);
        putPosition(Math.round(positionRef.current));
      }
    };
    preference.addEventListener("change", change);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", change);
    };
  }, [putPosition, setPlayback]);

  useEffect(() => {
    if (!visible || !foreground || (!playingRef.current && !motion.current))
      return;
    let frame = 0;
    let previous: number | null = null;
    let disposed = false;
    const tick = (time: number) => {
      if (disposed) return;
      // A new visibility session starts its own clock, without hidden-time jumps.
      const delta = previous === null ? 0 : Math.min(64, time - previous);
      previous = time;
      const movement = motion.current;
      if (movement) {
        movement.elapsed += delta;
        const fraction =
          movement.duration === 0
            ? 1
            : Math.min(1, movement.elapsed / movement.duration);
        putPosition(
          movement.from + (movement.to - movement.from) * smooth(fraction),
        );
        if (fraction >= 1) {
          motion.current = null;
          hold.current = 0;
          if (playingRef.current && movement.to >= LAST) setPlayback(false);
        }
      } else if (playingRef.current) {
        hold.current += delta;
        if (hold.current >= HOLD_MS) {
          hold.current = 0;
          const next = Math.min(
            LAST,
            Math.floor(positionRef.current + 0.001) + 1,
          );
          if (positionRef.current >= LAST) setPlayback(false);
          else
            motion.current = {
              from: positionRef.current,
              to: next,
              elapsed: 0,
              duration: reduced ? 0 : ZOOM_MS * (next - positionRef.current),
            };
        }
      }
      if (playingRef.current || motion.current)
        frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
    };
  }, [
    playing,
    visible,
    foreground,
    reduced,
    revision,
    putPosition,
    setPlayback,
  ]);

  const seek = (value: number) => {
    setPlayback(false);
    motion.current = null;
    hold.current = 0;
    putPosition(value);
    wake((n) => n + 1);
  };
  const go = (value: number) => {
    setPlayback(false);
    hold.current = 0;
    const target = clamp(value);
    if (reduced || Math.abs(target - positionRef.current) < 0.001) {
      motion.current = null;
      putPosition(target);
    } else {
      motion.current = {
        from: positionRef.current,
        to: target,
        elapsed: 0,
        duration: Math.min(
          4000,
          ZOOM_MS * Math.abs(target - positionRef.current),
        ),
      };
    }
    wake((n) => n + 1);
  };
  const togglePlayback = () => {
    if (playingRef.current) {
      setPlayback(false);
      motion.current = null;
    } else {
      motion.current = null;
      hold.current = 0;
      if (positionRef.current >= LAST - 0.001) putPosition(0);
      setPlayback(true);
    }
    wake((n) => n + 1);
  };

  const scenes = useMemo(
    () =>
      STAGES.map((stage) => (
        <ScaleJourneyScene
          key={stage.id}
          stage={stage.id}
          prefix={`journey-${id}`}
        />
      )),
    [id],
  );
  const base = Math.min(LAST, Math.floor(position));
  const fraction = position - base;
  const selected = Math.round(position);
  const stage = STAGES[selected];
  const target = JOURNEY_TARGETS[STAGES[base].id];
  const ratio = target.width / 600;
  const endScale = 1 / ratio;
  const scale = Math.pow(endScale, fraction);
  const progress = (scale - 1) / (endScale - 1);
  const tx = (300 - endScale * target.cx) * progress;
  const ty = (180 - endScale * target.cy) * progress;
  const camera = `translate(${tx} ${ty}) scale(${scale})`;
  const incoming = smooth(Math.max(0, Math.min(1, (fraction - 0.12) / 0.76)));
  const outgoing =
    1 - smooth(Math.max(0, Math.min(1, (fraction - 0.72) / 0.28)));
  const settled =
    Math.abs(position - Math.round(position)) < 0.0001 && !motion.current;
  const active = visible && foreground && (playing || motion.current !== null);
  return (
    <section
      ref={host}
      className="scale-journey"
      aria-labelledby={`${id}-title`}
      data-stage={stage.id}
      data-position={position.toFixed(4)}
      data-playing={playing ? "true" : "false"}
      data-active={active ? "true" : "false"}
    >
      <div className="journey-heading">
        <span>
          <Focus size={15} />
          {t("走进材料内部", "A WORLD WITHIN")}
        </span>
        <span className="journey-count">
          {String(selected + 1).padStart(2, "0")} / 05
        </span>
      </div>
      <div className="journey-view">
        <svg
          viewBox="0 0 600 360"
          className="journey-canvas"
          data-testid="journey-canvas"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
        >
          <defs>
            <clipPath id={`${id}-clip`}>
              <rect width="600" height="360" rx="5" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-clip)`} aria-hidden="true">
            <g
              className="journey-scene-out"
              data-level={STAGES[base].id}
              transform={camera}
              opacity={outgoing}
            >
              {scenes[base]}
            </g>
            {base < LAST && (
              <g
                className="journey-scene-in"
                data-level={STAGES[base + 1].id}
                transform={`${camera} translate(${target.cx - target.width / 2} ${target.cy - target.width * 0.3}) scale(${ratio})`}
                opacity={incoming}
              >
                {scenes[base + 1]}
              </g>
            )}
          </g>
        </svg>
        <div className="journey-scale">
          <span>{t("示意视野", "Illustrative field")}</span>
          <strong>{stage.scale}</strong>
        </div>
        {settled && base < LAST && (
          <button
            className="journey-focus"
            data-testid="journey-focus"
            style={{
              left: `${((target.cx - target.width / 2) / 600) * 100}%`,
              top: `${((target.cy - target.width * 0.3) / 360) * 100}%`,
              width: `${(target.width / 600) * 100}%`,
              height: `${(target.width / 600) * 100}%`,
            }}
            onFocus={() => seek(positionRef.current)}
            onClick={() => {
              go(base + 1);
              host.current
                ?.querySelector<HTMLButtonElement>(
                  `[data-testid="journey-stage-${STAGES[base + 1].id}"]`,
                )
                ?.focus({ preventScroll: true });
            }}
            aria-label={t(...STAGES[base].focus)}
          >
            <span className="journey-focus-plus">
              <ZoomIn size={18} />
            </span>
            <span className="journey-focus-label">
              {t(...STAGES[base].focus)}
            </span>
          </button>
        )}
        <div className="journey-depth" aria-hidden="true">
          {STAGES.map((s, i) => (
            <i key={s.id} className={i <= selected ? "is-reached" : ""} />
          ))}
        </div>
      </div>
      <div className="journey-caption" aria-live="polite" aria-atomic="true">
        <h2 id={`${id}-title`}>{t(...stage.title)}</h2>
        <p id={`${id}-description`}>{t(...stage.caption)}</p>
      </div>
      <nav
        className="journey-stages"
        aria-label={t("选择观察尺度", "Choose a scale")}
      >
        {STAGES.map((item, i) => (
          <button
            key={item.id}
            data-testid={`journey-stage-${item.id}`}
            aria-pressed={selected === i}
            aria-label={t(`查看${item.short[0]}层级`, `View ${item.id}`)}
            onClick={() => go(i)}
          >
            <span>0{i + 1}</span>
            {t(...item.short)}
          </button>
        ))}
      </nav>
      <div className="journey-controls">
        <button
          className="journey-play"
          data-testid="journey-play"
          onClick={togglePlayback}
          aria-label={
            playing
              ? t("暂停探索", "Pause the tour")
              : position >= LAST
                ? t("重新播放探索", "Replay the tour")
                : t("自动探索", "Play the tour")
          }
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          <span>
            {playing
              ? t("暂停", "Pause")
              : position >= LAST
                ? t("重播", "Replay")
                : t("自动探索", "Play tour")}
          </span>
        </button>
        <button
          className="journey-step"
          data-testid="journey-previous"
          aria-label={t("缩小一级", "Zoom out one level")}
          title={t("缩小一级", "Zoom out one level")}
          disabled={position <= 0.0001}
          onClick={() => go(Math.ceil(position - 0.001) - 1)}
        >
          <ZoomOut size={18} />
        </button>
        <input
          data-testid="journey-progress"
          type="range"
          min="0"
          max={LAST}
          step="0.01"
          value={position}
          onFocus={() => seek(positionRef.current)}
          onChange={(e) => seek(Number(e.currentTarget.value))}
          aria-label={t(
            "连续调整放大层级",
            "Adjust the zoom level continuously",
          )}
          aria-valuetext={t(
            `${stage.short[0]}，第${selected + 1}层，共5层`,
            `${stage.short[1]}, level ${selected + 1} of 5`,
          )}
        />
        <button
          className="journey-step"
          data-testid="journey-next"
          aria-label={t("放大一级", "Zoom in one level")}
          title={t("放大一级", "Zoom in one level")}
          disabled={position >= LAST - 0.0001}
          onClick={() => go(Math.floor(position + 0.001) + 1)}
        >
          <ZoomIn size={18} />
        </button>
        <button
          className="journey-reset"
          data-testid="journey-reset"
          aria-label={t("回到整个构件", "Return to the whole object")}
          title={t("回到整个构件", "Return to the whole object")}
          onClick={() => seek(0)}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="journey-note">
        {t(
          "概念性放大 · 尺度随材料与工况变化",
          "A conceptual zoom · scales vary with material and conditions",
        )}
      </p>
    </section>
  );
}
