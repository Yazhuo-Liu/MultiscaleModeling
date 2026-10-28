import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Move3D,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../i18n";
import {
  createVacancyDemo,
  type VacancyParameters,
} from "../simulations/vacancy-demo";
import VacancyLatticeView from "./VacancyLatticeView";

const presets: {
  id: string;
  zh: string;
  en: string;
  parameters: VacancyParameters;
  whyZh: string;
  whyEn: string;
}[] = [
  {
    id: "free",
    zh: "自由漫步",
    en: "Free wandering",
    parameters: { temperature: 1, trap: 0 },
    whyZh: "所有位置一样好。每次随机选一个方向，邻居就有机会填入空位。",
    whyEn:
      "Every site has the same energy. A random direction gives a neighbour a chance to fill the vacancy.",
  },
  {
    id: "cold",
    zh: "低温俘获",
    en: "Cold trap",
    parameters: { temperature: 0.25, trap: 2 },
    whyZh: "中心附近更有利。低温时，离开这里的尝试较难被接受。",
    whyEn:
      "Sites near the centre are favoured. At low temperature, attempts to leave are less likely to be accepted.",
  },
  {
    id: "warm",
    zh: "升温探索",
    en: "Warm exploration",
    parameters: { temperature: 1.5, trap: 2 },
    whyZh: "保持同一个俘获区，升温后更容易接受向较高能量位置的尝试。",
    whyEn:
      "Keep the same trap and raise the temperature: proposals to higher-energy sites are more likely to be accepted.",
  },
];

export default function VacancyDiffusionDemo() {
  const { t, locale } = useLanguage();
  const [engine] = useState(() => createVacancyDemo());
  const [frame, setFrame] = useState(() => engine.snapshot());
  const [preset, setPreset] = useState("free");
  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const [playback, setPlayback] = useState<"paused" | "playing" | "stepping">(
    "paused",
  );
  const [progress, setProgress] = useState(1);
  const [active, setActive] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [motionOptIn, setMotionOptIn] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const progressRef = useRef(1);
  const hold = useRef(0);
  const stateRef = useRef({ frame, playback, reduced, motionOptIn });
  stateRef.current = { frame, playback, reduced, motionOptIn };
  const setAnimation = (value: number) => {
    progressRef.current = value;
    setProgress(value);
  };
  const begin = useCallback(() => {
    const next = engine.attempt();
    setFrame(next);
    if (stateRef.current.reduced && !stateRef.current.motionOptIn) {
      progressRef.current = 1;
      setProgress(1);
      setPlayback("paused");
    } else {
      progressRef.current = 0;
      setProgress(0);
    }
    hold.current = 0;
  }, [engine]);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        setPlayback("paused");
        setMotionOptIn(false);
      }
    };
    preference.addEventListener("change", changed);
    return () => preference.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(
      (entries) => {
        visible =
          entries[0].isIntersecting && entries[0].intersectionRatio >= 0.1;
        update();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (!active || playback === "paused") return;
    let request = 0,
      previous = 0;
    const tick = (now: number) => {
      const delta = previous ? Math.min(now - previous, 60) : 0;
      previous = now;
      if (progressRef.current < 1) {
        const value = Math.min(1, progressRef.current + delta / 680);
        progressRef.current = value;
        setProgress(value);
        if (value === 1 && stateRef.current.playback === "stepping") {
          setPlayback("paused");
          return;
        }
      } else {
        hold.current += delta;
        if (hold.current >= 240 && stateRef.current.playback === "playing")
          begin();
      }
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [active, playback, begin]);
  const reset = (parameters = frame.parameters, id = preset) => {
    setPlayback("paused");
    setAnimation(1);
    hold.current = 0;
    setFrame(engine.reset(parameters));
    setPreset(id);
    setResetToken((x) => x + 1);
  };
  const selected = presets.find((p) => p.id === preset)!;
  const moving = frame.move?.accepted && progress < 1;
  const phase = !frame.move
    ? t(
        "跟着金色空位看：哪个邻居会填进来？",
        "Follow the gold vacancy: which neighbour will fill it?",
      )
    : moving
      ? t(
          "原子填入空位，空位向相反方向移动",
          "The atom fills the vacancy; the vacancy moves the other way",
        )
      : frame.move.boundary
        ? t(
            "遇到晶体边缘，这次尝试保持原位",
            "At the crystal edge, this attempt stays in place",
          )
        : frame.move.accepted
          ? t(
              "交换完成。下一次尝试会选择哪个方向？",
              "Exchange complete. Which direction will be tried next?",
            )
          : t(
              "这次尝试未被接受，原子留在原位",
              "This proposal was rejected; the atom stays put",
            );
  return (
    <section
      className="vacancy-demo"
      aria-label={t("空位与原子扩散演示", "Vacancy and atomic diffusion demo")}
      data-attempts={frame.attempts}
      data-accepted={frame.accepted}
      data-running={playback !== "paused"}
      data-progress={progress.toFixed(3)}
      data-vacancy={JSON.stringify(frame.vacancy)}
      data-vacancy-trail={JSON.stringify(frame.vacancyTrail)}
      data-moving-atom-id={moving ? frame.move?.atomId : undefined}
    >
      <header className="vacancy-heading">
        <div>
          <span className="eyebrow">
            {t("跟着一个空位走", "FOLLOW A VACANCY")}
          </span>
          <h2>{t("空位怎样一步步移动？", "How does a vacancy move?")}</h2>
          <p>
            {t(
              "金色圈标记一个没有原子的格点。邻近原子填进来后，原子原来的位置就空了：空位因此向相反方向移动。",
              "The gold rings mark an empty lattice site. When a neighbour fills it, that atom leaves its old site empty: the vacancy moves in the opposite direction.",
            )}
          </p>
        </div>
        <span className="vacancy-model-tag">
          {t("简化晶格", "Lattice model")}
        </span>
      </header>
      <div
        className="vacancy-presets"
        aria-label={t("选择观察场景", "Choose a scene")}
      >
        {presets.map((p) => (
          <button
            key={p.id}
            data-testid={`vacancy-preset-${p.id}`}
            className={p.id === preset ? "active" : ""}
            aria-pressed={p.id === preset}
            onClick={() => reset(p.parameters, p.id)}
          >
            {locale === "zh" ? p.zh : p.en}
          </button>
        ))}
      </div>
      <p className="vacancy-preset-explanation">
        {locale === "zh" ? selected.whyZh : selected.whyEn}
      </p>
      <div className="vacancy-stage" ref={stage}>
        <div className="vacancy-stage-toolbar">
          <span>
            {t(
              "125 个格点 · 124 个原子 · 1 个空位",
              "125 sites · 124 atoms · 1 vacancy",
            )}
          </span>
          <div className="vacancy-view-toggle">
            <button
              data-testid="vacancy-view-3d"
              aria-pressed={mode === "3d"}
              onClick={() => setMode("3d")}
            >
              <Move3D size={15} />
              3D
            </button>
            <button
              data-testid="vacancy-view-2d"
              aria-pressed={mode === "2d"}
              onClick={() => setMode("2d")}
            >
              <Layers size={15} />
              {t("截面", "Slice")}
            </button>
          </div>
        </div>
        <VacancyLatticeView
          frame={frame}
          progress={progress * progress * (3 - 2 * progress)}
          mode={mode}
          active={active}
          resetToken={resetToken}
        />
        <div className="vacancy-legend">
          <span>
            <i className="vacancy-key-hole" />
            {t("空位 / 移动轨迹", "Vacancy / trail")}
          </span>
          <span>
            <i className="vacancy-key-atom" />
            {t("晶格原子", "Lattice atom")}
          </span>
          <span>
            <i className="vacancy-key-moving" />
            {t(
              "正在交换的原子（暂时强调）",
              "Exchanging atom (temporary highlight)",
            )}
          </span>
          {frame.parameters.trap > 0 && (
            <span>
              <i className="vacancy-key-trap" />
              {t("浅金区域：中心俘获区", "Pale gold: central trap")}
            </span>
          )}
        </div>
        <div className="vacancy-view-help">
          {mode === "3d"
            ? t(
                "拖动旋转 · 滚轮缩放 · 金色轨迹只记录空位走过的位置",
                "Drag to rotate · scroll to zoom · the gold trail follows the vacancy",
              )
            : t(
                `截面跟随空位：第 ${frame.vacancy[2] + 1} 层 / 共 5 层`,
                `Slice follows the vacancy: layer ${frame.vacancy[2] + 1} of 5`,
              )}
        </div>
      </div>
      <div
        className="vacancy-status"
        aria-live={playback === "playing" ? "off" : "polite"}
      >
        <span className={`vacancy-status-dot ${moving ? "moving" : ""}`} />
        <p>{phase}</p>
      </div>
      <div className="vacancy-playback">
        <button
          className="button primary"
          data-testid="vacancy-play"
          onClick={() => {
            if (playback !== "paused") setPlayback("paused");
            else {
              setMotionOptIn(true);
              hold.current = 240;
              setPlayback("playing");
            }
          }}
        >
          {playback !== "paused" ? <Pause size={17} /> : <Play size={17} />}
          {playback !== "paused"
            ? t("暂停", "Pause")
            : t("开始观察", "Start exploring")}
        </button>
        <button
          className="button"
          data-testid="vacancy-step"
          disabled={playback !== "paused" || progress < 1}
          onClick={() => {
            setPlayback("stepping");
            begin();
          }}
        >
          <SkipForward size={17} />
          {t("尝试一步", "Try one step")}
        </button>
        <button
          className="button"
          data-testid="vacancy-reset"
          onClick={() => reset()}
        >
          <RotateCcw size={17} />
          {t("重新开始", "Restart")}
        </button>
        <div className="vacancy-counts">
          <span>
            <b>{frame.attempts}</b>
            {t("次尝试", "attempts")}
          </span>
          <span>
            <b>{frame.accepted}</b>
            {t("次交换", "exchanges")}
          </span>
        </div>
      </div>
      <div className="vacancy-observation">
        <strong>{t("试着比较", "Try a comparison")}</strong>
        <p>
          {t(
            "先观察自由漫步，再比较低温和升温后的俘获区。注意“尝试”和“交换”的差别：一次尝试不一定让原子移动。",
            "Explore free wandering, then compare the cold and warm trap. Watch the difference between attempts and exchanges: a proposal does not always move an atom.",
          )}
        </p>
      </div>
      <details className="vacancy-rules">
        <summary>
          {t("这个演示用了什么规则？", "What rules does this demo use?")}
        </summary>
        <div>
          <p>
            {t(
              "每次等概率选择六个方向之一，尝试交换空位和相邻原子。能量降低时接受；能量升高时，温度越高越容易接受。越过晶体边缘的尝试直接拒绝。",
              "Each attempt chooses one of six directions with equal probability and proposes a vacancy–neighbour exchange. Energy-lowering moves are accepted; uphill moves are more likely to be accepted at higher temperature. Proposals beyond the crystal edge are rejected.",
            )}
          </p>
          <p>
            {t(
              "温度和俘获能使用教学单位。俘获区只是为中心附近的位置设置较低能量，不计算真实原子势；自由漫步时各位置等能，改变温度不会改变接受规则。",
              "Temperature and trap energy use teaching units. The trap assigns lower energy near the centre, without a realistic interatomic potential. In free wandering all sites have equal energy, so temperature would not change the acceptance rule.",
            )}
          </p>
          <p>
            {t(
              "这是 Metropolis 采样的扩散图景：尝试次数不是物理时间，动画速度不代表真实扩散速度，也不能据此计算材料的扩散系数。所有球表示同一种原子；只在交换过程中短暂强调当次移动的邻居。",
              "This illustrates diffusion-like moves in Metropolis sampling. Attempts are not physical time; animation speed is not a diffusion rate and cannot yield a material diffusion coefficient. All spheres represent identical atoms; only the neighbour moving in the current exchange is briefly highlighted.",
            )}
          </p>
          <a href="#/method/kmc">
            {t(
              "想知道一次跳跃要等多久？继续看 KMC",
              "How long until the next hop? Explore KMC",
            )}
            <ArrowRight size={15} />
          </a>
        </div>
      </details>
      <p className="vacancy-footnote">
        {t(
          "MC 尝试次数 ≠ 物理时间；动画展示交换过程。",
          "MC attempts ≠ physical time; animation illustrates the exchange.",
        )}
      </p>
    </section>
  );
}
