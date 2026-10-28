import type { Locale } from "../i18n";
import type { MethodId } from "../types";

type Bilingual = { zh: string; en: string };
export interface LabGuide {
  question: Bilingual;
  observe: Bilingual;
  legend: Bilingual;
  presets: { label: Bilingual; params: Record<string, number> }[];
}
const words = (zh: string, en: string): Bilingual => ({ zh, en });
const guides: Record<MethodId, LabGuide> = {
  dft: {
    question: words(
      "原子核拉得更强，电子云会怎样？",
      "What happens when the nucleus pulls more strongly?",
    ),
    observe: words(
      "先运行，再换成更强的核吸引：观察电子云范围和曲线峰的位置。",
      "Run, then try a stronger nucleus. Watch the cloud's extent and the curve's peak.",
    ),
    legend: words(
      "紫色示意试探电子云的宽窄；查看对应曲线，还能看到不同半径处找到电子的概率分布。",
      "Purple illustrates the width of the trial cloud. Inspect the curve to see the probability distribution at different radii.",
    ),
    presets: [
      {
        label: words("较弱核吸引", "Weaker nucleus"),
        params: { charge: 1, exponent: 0.3 },
      },
      {
        label: words("较强核吸引", "Stronger nucleus"),
        params: { charge: 3, exponent: 0.3 },
      },
    ],
  },
  hf: {
    question: words(
      "两个位置，电子更喜欢哪一边？",
      "Two sites: which one do the electrons favor?",
    ),
    observe: words(
      "比较两边一样与 A 位置更低能的情况。运行后，观察两个圆的面积如何改变。",
      "Compare equal sites with a lower-energy site A. Run and watch the areas of the two circles change.",
    ),
    legend: words(
      "圆的面积代表平均电子数，并非电子轨道；总电子数始终为 2。",
      "Circle area represents average electron occupation, not an orbital; the total stays at two electrons.",
    ),
    presets: [
      {
        label: words("两边一样", "Equal sites"),
        params: { interaction: 0, bias: 0 },
      },
      {
        label: words("A 更低能", "A is lower in energy"),
        params: { interaction: 0, bias: 2 },
      },
    ],
  },
  md: {
    question: words(
      "温度更高，原子一开始怎样运动？",
      "How does a higher temperature change initial motion?",
    ),
    observe: words(
      "用同一个初始排列比较冷、热两种情况：重点看原子离开原位置的快慢。",
      "Compare cool and warm starts from the same arrangement. Watch how quickly atoms leave their starting positions.",
    ),
    legend: words(
      "每个球是一个原子；盒子边界相连，离开一侧的原子会从另一侧出现。",
      "Each sphere is an atom. Opposite box faces join, so an atom leaving one side reappears on the other.",
    ),
    presets: [
      {
        label: words("较冷的初态", "Cool start"),
        params: { temperature: 0.2, density: 0.6 },
      },
      {
        label: words("较热的初态", "Warm start"),
        params: { temperature: 1.2, density: 0.6 },
      },
    ],
  },
  mc: {
    question: words(
      "随机尝试，为什么仍会出现有序区域？",
      "How can random trials produce ordered patches?",
    ),
    observe: words(
      "对比低温与高温。看同色区域能否连成片；每一步是随机尝试，不是秒。",
      "Compare low and high temperatures. Watch for connected patches of one color; steps count trials, not seconds.",
    ),
    legend: words(
      "每格是一个可朝上或朝下的自旋；两种颜色表示两个方向。",
      "Each cell is a spin that can point up or down; the colors distinguish those directions.",
    ),
    presets: [
      {
        label: words("低温：容易有序", "Cool: order favored"),
        params: { temperature: 1, field: 0 },
      },
      {
        label: words("高温：涨落明显", "Warm: more fluctuations"),
        params: { temperature: 3.5, field: 0 },
      },
    ],
  },
  dd: {
    question: words(
      "一条被钉住的位错，受力后会怎样？",
      "How does a pinned dislocation respond to stress?",
    ),
    observe: words(
      "两端保持不动。比较较小、较大的推力，观察中间的位错线向外弯曲多少。",
      "The two ends stay fixed. Compare a gentle and a stronger push, and watch the line bow between them.",
    ),
    legend: words(
      "橙色端点是固定障碍物；连线是一条位错，节点只是描述线的位置。",
      "Orange endpoints are fixed obstacles. The connecting line is one dislocation; its nodes describe its shape.",
    ),
    presets: [
      {
        label: words("轻轻推", "Gentle push"),
        params: { stress: 0.2, tension: 1 },
      },
      {
        label: words("用力推", "Stronger push"),
        params: { stress: 0.8, tension: 1 },
      },
    ],
  },
  kmc: {
    question: words(
      "一样多次跳跃，为什么耗时不同？",
      "Why can the same number of hops take different times?",
    ),
    observe: words(
      "保持势垒不变，分别走几步。两种温度的跳跃序列相同，但“经过时间”读数不同。",
      "Keep the barrier fixed and step a few times. The hop sequence is the same at both temperatures, but the elapsed time differs.",
    ),
    legend: words(
      "青色点是晶格位置，橙色空心圆是空位；播放速度不代表真实跳跃速度。",
      "Teal dots mark lattice sites; the orange ring is a vacancy. Playback speed is not the physical hopping rate.",
    ),
    presets: [
      {
        label: words("低温：等待更久", "Cool: longer waits"),
        params: { temperature: 400, barrier: 0.5 },
      },
      {
        label: words("高温：等待更短", "Warm: shorter waits"),
        params: { temperature: 1000, barrier: 0.5 },
      },
    ],
  },
  "phase-field": {
    question: words(
      "杂乱的相界，会慢慢变成什么形状？",
      "What happens to an irregular phase boundary?",
    ),
    observe: words(
      "比较低、高迁移率。使用相同初始结构，观察细碎区域消退、界面变平滑的快慢。",
      "Compare low and high mobility from the same starting structure. Watch how quickly fine features fade and boundaries become smoother.",
    ),
    legend: words(
      "相界将两相分开；在截面中，两种颜色表示不同的相。",
      "The interface separates two phases. In a section, the two colors indicate the different phases.",
    ),
    presets: [
      {
        label: words("界面慢慢移动", "Slow interface"),
        params: { mobility: 0.3, gradient: 1 },
      },
      {
        label: words("界面更快移动", "Faster interface"),
        params: { mobility: 1.5, gradient: 1 },
      },
    ],
  },
  "crystal-plasticity": {
    question: words(
      "同样受拉，为什么有些晶粒先滑动？",
      "Why do some grains slip before others under the same load?",
    ),
    observe: words(
      "逐渐加载，看哪些格子先出现白色标记。它们的滑移方向更有利，未必是受力更大的晶粒。",
      "Increase the load and see which cells gain a white mark first. Their slip directions are more favorably oriented.",
    ),
    legend: words(
      "每格代表一个理想晶粒，斜线给出取向；白色短线表示达到滑移阈值。格子形状只是示意。",
      "Each cell is an idealized grain; hatching shows orientation. A white mark means the slip threshold is reached. Square grain shapes are schematic.",
    ),
    presets: [
      {
        label: words("较小拉力", "Lower load"),
        params: { stress: 50, strength: 40 },
      },
      {
        label: words("较大拉力", "Higher load"),
        params: { stress: 180, strength: 40 },
      },
    ],
  },
  constitutive: {
    question: words(
      "拉长后保持不动，材料的拉力还会变吗？",
      "Can the force change while the extension stays fixed?",
    ),
    observe: words(
      "夹具保持原位，观察拉力指示条变短。比较容易松弛与缓慢松弛两种材料。",
      "The grips stay still while the force indicator shrinks. Compare quickly and slowly relaxing materials.",
    ),
    legend: words(
      "夹具间距表示固定伸长；指示条显示当前应力占初始应力的比例。",
      "Grip spacing represents fixed extension; the indicator shows current stress as a fraction of its initial value.",
    ),
    presets: [
      {
        label: words("松弛较快", "Quick relaxation"),
        params: { modulus: 100, relaxation: 0.5 },
      },
      {
        label: words("松弛较慢", "Slow relaxation"),
        params: { modulus: 100, relaxation: 4 },
      },
    ],
  },
  fem: {
    question: words(
      "一根杆被拉长时，哪一端移动最多？",
      "Which part of a stretched bar moves the most?",
    ),
    observe: words(
      "左端固定，右端受拉。比较两个载荷，观察分段杆如何逐渐伸长。",
      "The left end is fixed and the right end is pulled. Compare two loads and watch the segmented bar extend.",
    ),
    legend: words(
      "每一小段是一个杆单元；虚线是未变形位置。变形放大 10,000 倍以便观察。",
      "Each segment is a bar element; the dashed outline is its undeformed position. Displacement is magnified 10,000 times.",
    ),
    presets: [
      {
        label: words("较小拉力", "Lower load"),
        params: { force: 25, modulus: 100 },
      },
      {
        label: words("较大拉力", "Higher load"),
        params: { force: 100, modulus: 100 },
      },
    ],
  },
  fdm: {
    question: words(
      "把薄板中间加热一下，热会去哪里？",
      "Where does heat go after warming the middle of a plate?",
    ),
    observe: words(
      "橙色热斑向四周散开，中心慢慢冷却。比较扩散较慢和较快的两种薄板。",
      "The orange hot spot spreads while its center cools. Compare plates with slow and fast heat diffusion.",
    ),
    legend: words(
      "橙色较热，蓝色较冷；边缘保持冷却，过程中不再持续加热。",
      "Orange is warmer and blue is cooler. The edges stay cold, and no further heat is added.",
    ),
    presets: [
      {
        label: words("扩散较慢", "Slow spreading"),
        params: { diffusivity: 0.2, source: 1 },
      },
      {
        label: words("扩散较快", "Fast spreading"),
        params: { diffusivity: 0.9, source: 1 },
      },
    ],
  },
};

export function getLabGuide(id: MethodId, locale: Locale) {
  const guide = guides[id];
  return {
    question: guide.question[locale],
    observe: guide.observe[locale],
    legend: guide.legend[locale],
    presets: guide.presets.map((preset) => ({
      label: preset.label[locale],
      params: preset.params,
    })),
  };
}
