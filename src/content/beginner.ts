import type { MethodId } from "../types";
import type { FoundationId } from "./foundations-types";
import type { Locale } from "../i18n";

export interface BeginnerLesson {
  question: string;
  everyday: string;
  takeaway: string;
  steps: { title: string; body: string }[];
  tryThis: string;
  notice: string;
  vocabulary: { term: string; meaning: string }[];
}

type LessonId = MethodId | FoundationId;
type BilingualLesson = { zh: BeginnerLesson; en: BeginnerLesson };

const lessons: Record<LessonId, BilingualLesson> = {
  dft: {
    zh: {
      question: "原子为什么会结合成材料？",
      everyday:
        "一块金属能够保持形状，背后是原子核与电子共同形成的稳定结构。先从一个更小的问题开始：原子核周围的电子云，应该聚得多紧？",
      takeaway: "DFT 从电子在空间中的分布出发，比较材料不同状态的能量。",
      steps: [
        {
          title: "先看一团电子云",
          body: "云的浓淡表示电子在不同位置出现的多少，不是电子绕核运动的轨迹。",
        },
        {
          title: "尝试改变它的宽度",
          body: "电子云太分散或太集中，都可能使能量升高。演示用一个可调宽度来寻找折中的状态。",
        },
        {
          title: "找到更稳定的状态",
          body: "在这里，能量更低表示更稳定。真实 DFT 会处理更复杂的电子分布；这个小例子先帮助我们理解优化的想法。",
        },
      ],
      tryThis: "先用较宽的电子云开始，再换成较窄的电子云，分别运行优化。",
      notice:
        "同一个原子核下，两次结果是否靠近相同的宽度？这里播放的是寻找答案的过程。",
      vocabulary: [
        { term: "电子密度", meaning: "空间中每一小块区域的平均电子数量。" },
        {
          term: "能量",
          meaning:
            "比较不同状态的一把尺子；在规定条件下，低能量状态通常更稳定。",
        },
        { term: "优化", meaning: "不断调整一个猜测，寻找更合适的答案。" },
      ],
    },
    en: {
      question: "Why do atoms bind together to form a material?",
      everyday:
        "A piece of metal holds its shape because nuclei and electrons form a stable structure together. Start with a smaller question: how tightly should an electron cloud gather around a nucleus?",
      takeaway:
        "DFT uses the distribution of electrons in space to compare the energies of different material states.",
      steps: [
        {
          title: "Picture an electron cloud",
          body: "The cloud shows how electrons are distributed in space. It does not trace an electron orbiting the nucleus.",
        },
        {
          title: "Change its width",
          body: "A cloud can cost more energy when it is too spread out or too concentrated. The demo adjusts one width to find a balance.",
        },
        {
          title: "Find a more stable state",
          body: "Here, lower energy means greater stability. Real DFT handles much richer distributions; this small example introduces optimization.",
        },
      ],
      tryThis:
        "Start with a broad cloud, then a narrow cloud, and run the optimization from each starting point.",
      notice:
        "For the same nucleus, do both runs approach the same width? Playback shows a search for an answer.",
      vocabulary: [
        {
          term: "Electron density",
          meaning:
            "The average number of electrons in each small region of space.",
        },
        {
          term: "Energy",
          meaning:
            "A way to compare states; under specified conditions, a lower energy state is usually more stable.",
        },
        {
          term: "Optimization",
          meaning: "Repeatedly adjusting a guess to find a better answer.",
        },
      ],
    },
  },
  hf: {
    zh: {
      question: "电子互相影响时，怎样找到一致的分布？",
      everyday:
        "多人围桌坐下时，一个人换座位可能让别人也想调整。电子也会互相影响，但它们遵守的是量子规则。我们先理解“调整到彼此一致”这件事。",
      takeaway:
        "Hartree–Fock 让每个电子感受其余电子的平均影响，再反复更新，直到前后吻合。",
      steps: [
        {
          title: "先猜电子在哪里",
          body: "演示只有两个可供电子分布的位置。我们先给出一个起始分配。",
        },
        {
          title: "根据邻居重新调整",
          body: "某处电子多，排斥影响也会改变。新的分布又会改变其他电子感受到的环境。",
        },
        {
          title: "检查是否还需要改变",
          body: "反复调整，直到结果几乎不再变化。这叫自洽，不意味着捕捉了电子之间的全部细节。",
        },
      ],
      tryThis: "先让两个位置一样有利，再增大位点能量差并运行。",
      notice: "电子会更偏向哪个位置？每次迭代的结果会不会逐渐稳定？",
      vocabulary: [
        {
          term: "平均场",
          meaning: "用周围电子的平均影响，代替逐个追踪所有相互影响。",
        },
        { term: "自洽", meaning: "用答案算出的环境，能够再次产生同样的答案。" },
        { term: "轨道", meaning: "描述单个电子量子状态的函数，不是运动路线。" },
      ],
    },
    en: {
      question:
        "How can interacting electrons settle into a consistent distribution?",
      everyday:
        "When people choose seats around a table, one person moving can make others adjust. Electrons also influence each other, although they obey quantum rules. Start with the idea of adjusting until the choices agree.",
      takeaway:
        "Hartree–Fock gives each electron the average influence of the others, then updates the result until it is consistent.",
      steps: [
        {
          title: "Guess where the electrons are",
          body: "The demo has only two places for electrons to occupy. We begin with a guessed distribution.",
        },
        {
          title: "Adjust to the surroundings",
          body: "More electrons at one place change the repulsion there. The new distribution changes the environment again.",
        },
        {
          title: "Check whether anything still changes",
          body: "Repeat until the answer barely changes. This is self-consistency; it does not capture every detail of electron interactions.",
        },
      ],
      tryThis:
        "First make the two sites equally favorable. Then increase their energy difference and run again.",
      notice:
        "Which site gains more electrons? Does the result settle as the iterations continue?",
      vocabulary: [
        {
          term: "Mean field",
          meaning:
            "The average influence of surrounding electrons, replacing a detailed account of every interaction.",
        },
        {
          term: "Self-consistency",
          meaning:
            "The environment calculated from an answer produces that same answer again.",
        },
        {
          term: "Orbital",
          meaning:
            "A function describing an electron's quantum state, not its travel path.",
        },
      ],
    },
  },
  md: {
    zh: {
      question: "一块看起来静止的材料，内部也在运动吗？",
      everyday:
        "桌上的金属块没有移动，但原子仍在不停运动。温度与这种微观运动有关。把时间放慢，我们就能观察它们怎样振动、碰撞和重新排列。",
      takeaway:
        "分子动力学把原子当作受力运动的粒子，用许多很小的时间步连接出一段运动过程。",
      steps: [
        {
          title: "放好原子",
          body: "每个球代表一个粒子。初始位置和速度决定这段演示从哪里开始。",
        },
        {
          title: "邻居产生作用",
          body: "粒子靠得太近会受到强烈排斥，稍远处可以相互吸引。演示用简单的相互作用来表示这件事。",
        },
        {
          title: "一步步往前走",
          body: "根据受力更新速度和位置，重复后便得到运动。三维视角让我们看到前后方向的变化。",
        },
      ],
      tryThis: "比较较低与较高的初始温度，旋转画面观察原子的三维运动。",
      notice:
        "更高的初始温度下，原子运动是否更剧烈？这个小体系不对应某一种具体金属。",
      vocabulary: [
        { term: "原子间势", meaning: "用距离等信息描述原子相互作用的规则。" },
        { term: "时间步", meaning: "计算每次向前推进的一小段时间。" },
        {
          term: "周期边界",
          meaning: "粒子离开一侧，就从相对的一侧出现，好像小盒子不断重复。",
        },
      ],
    },
    en: {
      question: "Can the inside of a stationary material still be moving?",
      everyday:
        "A metal block on a table stays in place, yet its atoms keep moving. Temperature is connected to that microscopic motion. Slow time down and we can watch vibrations, collisions and rearrangements.",
      takeaway:
        "Molecular dynamics treats atoms as particles moving under forces and joins many small time steps into a motion history.",
      steps: [
        {
          title: "Place the atoms",
          body: "Each sphere represents a particle. Initial positions and velocities set the starting point.",
        },
        {
          title: "Let neighbors interact",
          body: "Particles strongly repel when too close and can attract at a greater distance. A simple interaction rule captures this idea.",
        },
        {
          title: "Move forward in small steps",
          body: "Forces update velocities and positions. Repeating this produces motion, including movement into and out of the screen.",
        },
      ],
      tryThis:
        "Compare lower and higher initial temperatures. Rotate the scene to inspect the motion in three dimensions.",
      notice:
        "Is motion more vigorous at the higher initial temperature? This small system does not represent a particular metal.",
      vocabulary: [
        {
          term: "Interatomic potential",
          meaning:
            "A rule describing how atoms interact, using information such as their separation.",
        },
        {
          term: "Time step",
          meaning: "The small interval by which a calculation advances.",
        },
        {
          term: "Periodic boundary",
          meaning:
            "A particle leaving one side enters the opposite side, as if the box repeated.",
        },
      ],
    },
  },
  mc: {
    zh: {
      question: "原子挤在一起，怎样还能换位置？",
      everyday:
        "想象一排满座的椅子空出一个座位：旁边的人挪过去，空位就移到了另一边。晶体里的空位也能帮助原子逐步换位。",
      takeaway:
        "蒙特卡洛通过随机尝试和接受规则探索可能的排列；这里用空位交换让这个过程变得可见。",
      steps: [
        {
          title: "找到一个空位",
          body: "晶格中留出一个没有原子的格点。观察它旁边哪些原子有机会移入。",
        },
        {
          title: "随机提出一次交换",
          body: "选一个相邻原子，尝试让它与空位换位置。演示用简单能量规则决定接受或拒绝。",
        },
        {
          title: "看很多次尝试后的变化",
          body: "原子和空位留下不同的轨迹。较高温度让一些不利的交换也更容易被接受；尝试次数不等于真实时间。",
        },
      ],
      tryThis: "跟踪一个原子和空位，再比较有俘获区域时较低、较高温度的结果。",
      notice: "空位向一个方向移动时，交换的原子向哪边移动？轨迹会绕回来吗？",
      vocabulary: [
        { term: "空位", meaning: "晶格中本该有原子、现在却空着的位置。" },
        { term: "随机采样", meaning: "用许多随机尝试来探索可能的状态。" },
        { term: "接受概率", meaning: "一次提出的变化被保留下来的机会。" },
      ],
    },
    en: {
      question: "How can atoms change places in a tightly packed solid?",
      everyday:
        "Imagine a row of occupied seats with one empty seat. A neighbor moves into it, leaving the next seat empty. A vacancy can similarly let atoms change places inside a crystal.",
      takeaway:
        "Monte Carlo explores possible arrangements through random proposals and acceptance rules. Vacancy swaps make that process visible here.",
      steps: [
        {
          title: "Find an empty site",
          body: "One lattice site has no atom. Look at the neighboring atoms that could move into it.",
        },
        {
          title: "Propose a random swap",
          body: "Choose a neighboring atom and try swapping it with the vacancy. A simple energy rule decides whether to accept the proposal.",
        },
        {
          title: "Watch many attempts",
          body: "Atoms and the vacancy leave different trails. Higher temperature allows more unfavorable swaps; the number of attempts is not physical time.",
        },
      ],
      tryThis:
        "Follow one atom and the vacancy, then compare lower and higher temperatures with a trapping region present.",
      notice:
        "When the vacancy moves one way, which way does the swapping atom move? Can a trail return to an earlier position?",
      vocabulary: [
        {
          term: "Vacancy",
          meaning: "An empty lattice site that would normally hold an atom.",
        },
        {
          term: "Random sampling",
          meaning: "Exploring possible states through many random trials.",
        },
        {
          term: "Acceptance probability",
          meaning: "The chance that a proposed change is kept.",
        },
      ],
    },
  },
  dd: {
    zh: {
      question: "为什么金属能留下永久的弯曲？",
      everyday:
        "把地毯整个拖动很费力，推动地毯上的一个褶皱却容易得多。金属中的位错也让原子逐步错动，而不必让整层原子同时滑开。这个类比只帮助理解局部移动。",
      takeaway:
        "位错动力学跟踪晶体内的线状缺陷，用它们的运动理解材料如何塑性变形。",
      steps: [
        {
          title: "先看一条缺陷线",
          body: "演示中的线代表位错。它的两个端点被固定，中间部分可以移动。",
        },
        {
          title: "用应力推动它",
          body: "外部剪切作用推动位错向前，而线自身倾向于缩短，抵抗弯曲。",
        },
        {
          title: "比较推动与回拉",
          body: "两种作用共同决定线弯曲多少。真实材料中，还有许多位错和障碍彼此影响。",
        },
      ],
      tryThis: "先增加剪应力，再增加线张力，比较位错线的弯曲程度。",
      notice: "更大的推动使线更弯吗？更强的线张力会怎样改变它？",
      vocabulary: [
        { term: "位错", meaning: "晶体中原子排列发生错位的一类线状缺陷。" },
        { term: "剪应力", meaning: "让材料相邻部分倾向于错开滑动的作用。" },
        {
          term: "线张力",
          meaning: "用一条线倾向于缩短的效果，近似描述位错对弯曲的抵抗。",
        },
      ],
    },
    en: {
      question: "Why can a metal keep a permanent bend?",
      everyday:
        "Dragging an entire carpet is difficult; moving a wrinkle along it is easier. A dislocation likewise allows atoms to shift locally instead of moving a whole plane at once. The carpet is only an analogy for localized motion.",
      takeaway:
        "Dislocation dynamics follows line defects in crystals to understand how materials deform permanently.",
      steps: [
        {
          title: "Look at a defect line",
          body: "The line in the demo represents a dislocation. Its ends are pinned while the middle can move.",
        },
        {
          title: "Push it with stress",
          body: "Applied shear drives the line forward. Its tendency to shorten resists the bending.",
        },
        {
          title: "Compare the competing effects",
          body: "The balance determines how far the line bows. Real materials contain many interacting dislocations and obstacles.",
        },
      ],
      tryThis:
        "Increase shear stress, then increase line tension, and compare the amount of bowing.",
      notice:
        "Does a stronger push bend the line further? What happens when line tension increases?",
      vocabulary: [
        {
          term: "Dislocation",
          meaning:
            "A line defect where the atomic arrangement of a crystal is disrupted.",
        },
        {
          term: "Shear stress",
          meaning:
            "A loading action that tends to slide adjacent parts past one another.",
        },
        {
          term: "Line tension",
          meaning:
            "An approximation in which a dislocation resists bending by tending to shorten.",
        },
      ],
    },
  },
  kmc: {
    zh: {
      question: "原子等了很久才跳一下，怎么模拟更长的时间？",
      everyday:
        "等公交时，不必每一毫秒都记录一次街道。知道下一辆车何时到，就能直接跳到那个事件。KMC 也把注意力放在少见但重要的变化上。",
      takeaway:
        "动力学蒙特卡洛用事件发生的快慢，选择下一次变化并推进物理时钟。",
      steps: [
        {
          title: "列出可能的跳跃",
          body: "空位周围的原子可以移入空位，每一种交换都是一个候选事件。",
        },
        {
          title: "给事件一个发生速率",
          body: "温度和迁移势垒决定事件平均发生得多快。这里四个方向的速率相同。",
        },
        {
          title: "跳到下一次事件",
          body: "选择一个事件，再抽取等待时间。我们省略了等待期间的原子振动，换取更长的时间范围。",
        },
      ],
      tryThis: "在相同跳跃次数下，比较较低与较高温度对应的累计物理时间。",
      notice:
        "更高温度通常使同样多的跳跃需要更短的等待时间；画面播放快慢不等于真实运动快慢。",
      vocabulary: [
        {
          term: "事件",
          meaning: "模型允许发生的一次变化，例如原子与空位交换。",
        },
        { term: "迁移势垒", meaning: "原子完成一次跳跃需要越过的能量障碍。" },
        { term: "速率", meaning: "一种事件平均每单位时间发生的次数。" },
      ],
    },
    en: {
      question: "How can we simulate long waits between rare atomic jumps?",
      everyday:
        "While waiting for a bus, we do not need a street record every millisecond. Knowing when the next bus arrives lets us jump to that event. KMC similarly focuses on rare but important changes.",
      takeaway:
        "Kinetic Monte Carlo uses event rates to select the next change and advance a physical clock.",
      steps: [
        {
          title: "List the possible jumps",
          body: "Atoms beside a vacancy can move into it. Each swap is a candidate event.",
        },
        {
          title: "Assign an event rate",
          body: "Temperature and the migration barrier determine how frequently an event occurs. The four directions here have equal rates.",
        },
        {
          title: "Jump to the next event",
          body: "Select an event and draw a waiting time. Skipping vibrations during the wait allows longer time spans.",
        },
      ],
      tryThis:
        "After the same number of jumps, compare the accumulated physical time at lower and higher temperatures.",
      notice:
        "Higher temperature usually makes the same number of jumps take less waiting time. Playback speed is not physical speed.",
      vocabulary: [
        {
          term: "Event",
          meaning:
            "One allowed change, such as an atom swapping with a vacancy.",
        },
        {
          term: "Migration barrier",
          meaning: "The energy obstacle an atom must overcome to make a jump.",
        },
        {
          term: "Rate",
          meaning:
            "How frequently a type of event occurs per unit time on average.",
        },
      ],
    },
  },
  "phase-field": {
    zh: {
      question: "材料内部的两种区域，边界怎样慢慢改变？",
      everyday:
        "观察一块正在融化的冰，冰和水之间的边界会移动。材料内部的不同区域也会长大或缩小。相场给每个位置一个数，用它描绘区域与边界。",
      takeaway: "相场用连续变化的场来表示不同区域，让界面随规则自然移动。",
      steps: [
        {
          title: "先用颜色区分区域",
          body: "两种颜色代表两种状态，中间颜色代表过渡区域。它们不必对应某种具体材料。",
        },
        {
          title: "给边界一个宽度",
          body: "模型里的边界是一条薄薄的过渡带，不是必须逐点追踪的锋利曲线。",
        },
        {
          title: "让形状逐渐演化",
          body: "这个例子会减少过于弯曲、零碎的界面。小区域可能消失，大区域变得更平滑。",
        },
      ],
      tryThis: "运行演示，旋转三维结构，再打开切片看看内部的两种区域。",
      notice:
        "小岛和细颈怎样变化？这个例子中的两种状态数量不要求分别保持不变。",
      vocabulary: [
        { term: "场", meaning: "给空间里的每个位置都赋予一个数。" },
        { term: "相界面", meaning: "两种不同状态之间的过渡区域。" },
        {
          term: "迁移率",
          meaning: "在同样推动作用下，界面改变得快还是慢的参数。",
        },
      ],
    },
    en: {
      question: "How do boundaries inside a material change their shape?",
      everyday:
        "When ice melts, the boundary between ice and water moves. Regions inside materials can also grow or shrink. A phase field assigns a number to every location to describe those regions and their boundaries.",
      takeaway:
        "A phase field represents regions with a smoothly varying field and lets their boundaries move according to a rule.",
      steps: [
        {
          title: "Distinguish regions by color",
          body: "Two colors represent two states; intermediate colors mark the transition. They need not represent a particular material.",
        },
        {
          title: "Give the boundary a width",
          body: "The boundary is a thin transition zone rather than a sharp line that must be tracked point by point.",
        },
        {
          title: "Watch the shape evolve",
          body: "This example reduces highly curved, fragmented interfaces. Small regions may vanish while larger ones become smoother.",
        },
      ],
      tryThis:
        "Run the demo, rotate the three-dimensional structure, then reveal a slice to inspect the regions inside.",
      notice:
        "What happens to small islands and narrow necks? The amount of each state is not conserved in this example.",
      vocabulary: [
        {
          term: "Field",
          meaning: "A number assigned to every location in space.",
        },
        {
          term: "Interface",
          meaning: "The transition region between two different states.",
        },
        {
          term: "Mobility",
          meaning:
            "A parameter controlling how quickly an interface responds to a given driving force.",
        },
      ],
    },
  },
  "crystal-plasticity": {
    zh: {
      question: "同一块金属里，为什么有些晶粒先开始滑移？",
      everyday:
        "一叠扑克牌沿牌面容易滑开，垂直压下却不一样。晶体也有更容易滑移的方向。许多取向不同的晶粒放在一起，对同一拉力会有不同反应。",
      takeaway:
        "晶体塑性把晶粒的取向和滑移联系起来，解释微观排列怎样影响整体变形。",
      steps: [
        {
          title: "看取向不同的晶粒",
          body: "每块区域代表一个晶粒。它们内部的排列方向不同。",
        },
        {
          title: "施加同一个拉力",
          body: "沿晶粒滑移方向的有效推动力并不相同，取向决定了拉力能转化出多少滑移作用。",
        },
        {
          title: "寻找先被激活的晶粒",
          body: "当有效推动达到门槛，该晶粒的滑移被激活。这个例子只判断启动，不计算完整的晶粒变形。",
        },
      ],
      tryThis: "逐渐提高目标应力，观察哪些晶粒先变色，再提高滑移门槛。",
      notice: "同一外部载荷下，是否所有晶粒同时激活？",
      vocabulary: [
        { term: "晶粒", meaning: "一小块原子排列方向大致一致的晶体区域。" },
        { term: "取向", meaning: "晶体内部排列相对于外部方向的朝向。" },
        { term: "滑移", meaning: "晶体的一部分沿特定方向相对另一部分错开。" },
      ],
    },
    en: {
      question: "Why do some grains in a metal start slipping before others?",
      everyday:
        "A deck of cards slides easily along its faces, but responds differently when pressed through its thickness. Crystals also have preferred slip directions. Grains with different orientations respond differently to the same pull.",
      takeaway:
        "Crystal plasticity connects grain orientation with slip to explain how microscopic structure affects deformation.",
      steps: [
        {
          title: "Look at differently oriented grains",
          body: "Each region represents a grain with its own internal alignment.",
        },
        {
          title: "Apply the same pull",
          body: "The effective push along a slip direction differs between grains. Orientation determines how much of the applied load promotes slip.",
        },
        {
          title: "Find the first active grains",
          body: "Slip activates when that push reaches a threshold. This example identifies onset rather than calculating full grain deformation.",
        },
      ],
      tryThis:
        "Gradually increase the target stress and watch which grains change color first. Then raise the slip threshold.",
      notice: "Do all grains activate together under the same external load?",
      vocabulary: [
        {
          term: "Grain",
          meaning:
            "A small crystal region with a largely consistent atomic orientation.",
        },
        {
          term: "Orientation",
          meaning:
            "How a crystal's internal arrangement is aligned with the outside world.",
        },
        {
          term: "Slip",
          meaning:
            "One part of a crystal shifting relative to another along a particular direction.",
        },
      ],
    },
  },
  constitutive: {
    zh: {
      question: "把材料拉长后一直握住，拉力会一直一样吗？",
      everyday:
        "有些材料拉开后会慢慢放松，即使长度没有改变，维持它的力也会下降。弹簧和缓慢流动的阻尼元件可以组合成一个简单模型。",
      takeaway:
        "本构关系描述材料怎样响应变形；这里先观察保持拉伸时的应力松弛。",
      steps: [
        {
          title: "先施加一段拉伸",
          body: "把材料拉到指定长度，随后保持这个长度。",
        },
        {
          title: "观察内部逐渐调整",
          body: "弹性部分原本承受较大拉力，缓慢流动的部分让这份拉力逐步释放。",
        },
        {
          title: "比较放松的速度",
          body: "松弛时间越长，拉力下降越慢。真实材料可能需要更多机制才能描述。",
        },
      ],
      tryThis: "保持其他设置不变，分别选择较短和较长的松弛时间。",
      notice: "哪条应力曲线下降更快？改变弹性模量后，初始应力又怎样改变？",
      vocabulary: [
        { term: "应变", meaning: "材料相对于原长度发生了多大程度的变形。" },
        { term: "应力", meaning: "单位截面积所承受的内部作用力。" },
        { term: "松弛", meaning: "变形保持不变时，应力随时间减小的现象。" },
      ],
    },
    en: {
      question:
        "If you stretch a material and hold it, does the required force stay the same?",
      everyday:
        "Some materials gradually relax after stretching. Their length stays fixed while the force needed to hold them decreases. A spring joined to a slowly flowing element gives a simple model.",
      takeaway:
        "A constitutive relation describes how a material responds to deformation. Here we begin with stress relaxation at fixed stretch.",
      steps: [
        {
          title: "Apply a stretch",
          body: "Stretch the material to a chosen length and then hold that length fixed.",
        },
        {
          title: "Watch it adjust internally",
          body: "The elastic part initially carries a larger force. Slow internal flow gradually releases that force.",
        },
        {
          title: "Compare relaxation speeds",
          body: "A longer relaxation time means a slower force decrease. Real materials may require additional mechanisms.",
        },
      ],
      tryThis:
        "Keep other settings unchanged and compare a short relaxation time with a long one.",
      notice:
        "Which stress curve falls faster? How does changing stiffness affect the initial stress?",
      vocabulary: [
        {
          term: "Strain",
          meaning: "Deformation measured relative to the original size.",
        },
        {
          term: "Stress",
          meaning: "Internal force per unit cross-sectional area.",
        },
        {
          term: "Relaxation",
          meaning:
            "A decrease in stress over time while deformation stays fixed.",
        },
      ],
    },
  },
  fem: {
    zh: {
      question: "一根杆被拉住时，每个位置会移动多少？",
      everyday:
        "左端固定一根杆，右端用力拉，越靠近右端的位置通常移动越多。复杂结构很难一次算清，有限元先把它分成容易处理的小段。",
      takeaway:
        "有限元把结构分成相连的小单元，再把各部分的受力与变形拼成整体答案。",
      steps: [
        {
          title: "把杆分成小段",
          body: "分段端点叫节点。模型先用这些节点的位置变化来描述整根杆。",
        },
        {
          title: "让相邻小段连起来",
          body: "相邻单元共享节点，不能各自随意移动。它们需要同时满足连接与受力条件。",
        },
        {
          title: "求整体的位移",
          body: "固定左端，给右端拉力，计算每个节点移动多少。图中形变被放大，便于观察。",
        },
      ],
      tryThis: "将端部拉力增大，再把材料的弹性模量增大，比较杆的伸长。",
      notice: "拉力越大是否伸长越多？材料越硬是否伸长越少？",
      vocabulary: [
        { term: "单元", meaning: "组成计算模型的一个小片段。" },
        { term: "节点", meaning: "连接单元、记录位移等量的位置。" },
        { term: "边界条件", meaning: "告诉模型哪里固定、哪里受力等外部约束。" },
      ],
    },
    en: {
      question: "When a bar is pulled, how far does each part move?",
      everyday:
        "Fix the left end of a bar and pull the right end. Points nearer the right usually move further. A complex structure is difficult to solve all at once, so finite elements divide it into manageable pieces.",
      takeaway:
        "The finite element method divides a structure into connected elements and combines their forces and deformations into one answer.",
      steps: [
        {
          title: "Divide the bar into segments",
          body: "The segment endpoints are nodes. Their movements describe the deformation of the bar.",
        },
        {
          title: "Keep neighboring pieces connected",
          body: "Adjacent elements share nodes and cannot move independently. Connections and force balance must hold together.",
        },
        {
          title: "Find the overall displacement",
          body: "Fix the left end, pull the right end, and solve for the movement at each node. The displayed deformation is magnified.",
        },
      ],
      tryThis:
        "Increase the end force, then increase the material stiffness, and compare the extension.",
      notice:
        "Does a larger force stretch the bar more? Does a stiffer material stretch less?",
      vocabulary: [
        {
          term: "Element",
          meaning: "One small piece of a computational model.",
        },
        {
          term: "Node",
          meaning:
            "A connection point where quantities such as displacement are recorded.",
        },
        {
          term: "Boundary condition",
          meaning:
            "An external constraint, such as a fixed end or an applied force.",
        },
      ],
    },
  },
  fdm: {
    zh: {
      question: "金属片上一个热斑，为什么会慢慢散开？",
      everyday:
        "勺子的一端放进热水，另一端也会逐渐变热。热量会从较热的地方传向较冷的地方。我们先在一块薄片上观察这个过程。",
      takeaway:
        "有限差分在规则网格上比较相邻位置，用局部差别来更新整个温度场。",
      steps: [
        {
          title: "把薄片铺成网格",
          body: "每个小格记录一个温度。中心较热，边缘保持较冷。",
        },
        {
          title: "比较邻居的温度",
          body: "比周围更热的格子会降温，周围较冷的格子可能升温。",
        },
        {
          title: "重复小幅更新",
          body: "一次次更新后，热斑变宽、峰值下降，热量最终通过冷边界流走。",
        },
      ],
      tryThis: "比较较小和较大的热扩散系数，看相同演化时间下热斑怎样变化。",
      notice: "热斑是整体移动，还是向周围散开？中心的颜色怎样改变？",
      vocabulary: [
        { term: "网格", meaning: "把连续空间分成许多规则位置来记录数据。" },
        { term: "温度场", meaning: "材料各个位置的温度分布。" },
        { term: "热扩散系数", meaning: "衡量温度差异传播得快还是慢的参数。" },
      ],
    },
    en: {
      question: "Why does a hot spot on a metal sheet gradually spread out?",
      everyday:
        "Put one end of a spoon in hot water and the other end gradually warms. Heat travels from hotter regions toward cooler ones. Start by watching this process on a thin sheet.",
      takeaway:
        "Finite differences compare neighboring locations on a regular grid and use local differences to update the temperature field.",
      steps: [
        {
          title: "Cover the sheet with a grid",
          body: "Each grid location records a temperature. The center starts hot while the edges stay cool.",
        },
        {
          title: "Compare neighboring temperatures",
          body: "A location hotter than its surroundings cools, while cooler neighbors may warm.",
        },
        {
          title: "Repeat small updates",
          body: "The hot spot broadens and its peak falls. Heat eventually leaves through the cold boundaries.",
        },
      ],
      tryThis:
        "Compare smaller and larger thermal diffusivities at the same elapsed simulation time.",
      notice:
        "Does the hot spot move as a whole, or spread into its surroundings? How does its center change color?",
      vocabulary: [
        {
          term: "Grid",
          meaning:
            "Regular locations used to record values across a continuous space.",
        },
        {
          term: "Temperature field",
          meaning: "The distribution of temperature throughout a material.",
        },
        {
          term: "Thermal diffusivity",
          meaning:
            "A parameter measuring how quickly temperature differences spread.",
        },
      ],
    },
  },
  "why-multiscale": {
    zh: {
      question: "一根金属件为什么断裂，需要放大多少倍才能看懂？",
      everyday:
        "远看是一根受力的构件，放大后是裂纹，再往里看是晶粒、缺陷和原子。每一层都能回答不同的问题，一张图很难把全部细节同时说清。",
      takeaway:
        "多尺度建模让不同大小、不同快慢的模型各司其职，再传递解决问题所需的信息。",
      steps: [
        {
          title: "先确定要回答的问题",
          body: "预测构件能承受多大载荷，需要知道整体形状；理解原子为何结合，需要关注电子。",
        },
        {
          title: "为每层保留重要细节",
          body: "看桥梁不必画每个原子，看成键又不能忽略电子。模型根据问题选择保留什么。",
        },
        {
          title: "把层次连接起来",
          body: "小尺度算出的材料性质，可以成为大尺度模型的输入，帮助预测整体行为。",
        },
      ],
      tryThis:
        "沿图示从构件看到原子，每到一层，想一个只有这一层才能回答的问题。",
      notice: "尺度变小时，观察对象和需要记录的信息也在改变。",
      vocabulary: [
        {
          term: "模型",
          meaning: "为了回答一个问题，对真实世界做出的有目的的简化。",
        },
        { term: "尺度", meaning: "所关心现象的大小和变化快慢。" },
        {
          term: "跨尺度传递",
          meaning: "把一个模型的结果作为另一个尺度模型的信息来源。",
        },
      ],
    },
    en: {
      question:
        "How far must we zoom in to understand why a metal component breaks?",
      everyday:
        "From far away we see a loaded component. Closer in, we find cracks, grains, defects and atoms. Each level answers different questions; one picture cannot show every detail equally well.",
      takeaway:
        "Multiscale modeling gives different sizes and time scales their own models, then passes along the information needed to answer a question.",
      steps: [
        {
          title: "Choose the question first",
          body: "Predicting a component's load capacity requires its overall shape. Understanding atomic bonding requires electrons.",
        },
        {
          title: "Keep the useful details",
          body: "A bridge model need not draw every atom, but a bonding model cannot ignore electrons. The question guides what is retained.",
        },
        {
          title: "Connect the levels",
          body: "Material properties calculated at a small scale can become inputs for a larger model that predicts overall behavior.",
        },
      ],
      tryThis:
        "Follow the illustration from a component down to atoms. At each level, name a question that level helps answer.",
      notice:
        "As the scale changes, the objects and information we need to record change too.",
      vocabulary: [
        {
          term: "Model",
          meaning:
            "A purposeful simplification of reality made to answer a question.",
        },
        {
          term: "Scale",
          meaning: "The size of a phenomenon and how quickly it changes.",
        },
        {
          term: "Scale transfer",
          meaning:
            "Using one model's results as information for a model at another scale.",
        },
      ],
    },
  },
  "scales-and-limits": {
    zh: {
      question: "既然原子组成一切，为什么不把所有原子都算出来？",
      everyday:
        "想象用一张逐根头发的画像记录整座城市的人群：细节很多，却很难回答交通是否拥堵。计算材料也一样，越细的描述不一定越适合当前问题。",
      takeaway:
        "选择模型时，要一起考虑问题、细节、计算代价和模型能相信到什么程度。",
      steps: [
        {
          title: "认识细节的代价",
          body: "记录更多原子、电子或时间变化，通常需要更多计算。小时间步重复很多次，也会变得昂贵。",
        },
        {
          title: "有目的地省略细节",
          body: "用晶粒代表许多原子，用连续材料代表许多晶粒，可以研究更大的物体和更长的过程。",
        },
        {
          title: "记住省略了什么",
          body: "简化让模型有用，也决定它的边界。不能用一个没有裂纹机制的模型，自动预测所有断裂现象。",
        },
      ],
      tryThis: "为“电子如何成键”“原子如何扩散”“构件弯曲多少”分别选择观察尺度。",
      notice: "同一种材料可以需要不同模型，因为问题不同。",
      vocabulary: [
        { term: "分辨率", meaning: "模型能够区分的最小细节。" },
        { term: "计算代价", meaning: "得到结果所需的时间、内存等资源。" },
        { term: "适用范围", meaning: "模型中的假设足以描述问题的条件范围。" },
      ],
    },
    en: {
      question: "If everything is made of atoms, why not calculate every atom?",
      everyday:
        "Imagine drawing every hair on every person in a city to study traffic. There would be enormous detail, yet it would not directly answer the question. More microscopic detail is not always more useful.",
      takeaway:
        "Choose a model by balancing the question, retained detail, computational cost and conditions under which its answers are trustworthy.",
      steps: [
        {
          title: "Recognize the cost of detail",
          body: "Recording more atoms, electrons or changes in time usually requires more computation. Many tiny time steps can also become expensive.",
        },
        {
          title: "Leave out details purposefully",
          body: "Grains can stand in for many atoms, and a continuous material can stand in for many grains, allowing larger objects and longer processes.",
        },
        {
          title: "Remember what was omitted",
          body: "Simplification makes a model useful and sets its limits. A model with no crack mechanism cannot automatically predict every kind of fracture.",
        },
      ],
      tryThis:
        "Choose a scale for each question: how electrons bond, how atoms diffuse, and how far a component bends.",
      notice:
        "The same material can require different models because the questions differ.",
      vocabulary: [
        {
          term: "Resolution",
          meaning: "The smallest detail a model can distinguish.",
        },
        {
          term: "Computational cost",
          meaning:
            "The time, memory and other resources needed to obtain a result.",
        },
        {
          term: "Range of validity",
          meaning:
            "Conditions under which a model's assumptions adequately describe the question.",
        },
      ],
    },
  },
  "error-propagation": {
    zh: {
      question: "上一步只差一点点，下一步会差多少？",
      everyday:
        "量尺寸时少量的偏差，可能让家具刚好卡在门口。把小尺度结果交给大尺度模型时，也要问：这些输入的偏差会不会被放大？",
      takeaway:
        "跨尺度传递的不只是一个数，也应包括它的不确定性，以及结果对它有多敏感。",
      steps: [
        {
          title: "先给输入一个范围",
          body: "材料性质或迁移势垒往往不是完全确定的单个数。可以用一个合理范围表达我们知道多少。",
        },
        {
          title: "让不同输入走过模型",
          body: "把范围里的不同数值分别代入，观察输出怎么变化。",
        },
        {
          title: "找到最值得改进的地方",
          body: "有些输入变化不大，结果却变化很多。优先改善这些敏感输入，可能比盲目增加计算更有效。",
        },
      ],
      tryThis:
        "增大材料软硬程度的散布，观察刚度和伸长量的范围；再改变弹性模量的中心值。",
      notice:
        "同一根杆越硬，在相同拉力下伸长就越少。两个输出的变化是否彼此关联？",
      vocabulary: [
        { term: "不确定性", meaning: "我们对一个数值或预测知道得有多精确。" },
        { term: "敏感性", meaning: "输入稍微改变时，输出改变得多明显。" },
        { term: "误差传播", meaning: "输入中的偏差经过计算后影响输出的过程。" },
      ],
    },
    en: {
      question:
        "If one step is slightly wrong, how much does the next step change?",
      everyday:
        "A small measurement error can make furniture just too wide for a doorway. When passing small-scale results to a larger model, we should also ask whether input errors will be amplified.",
      takeaway:
        "Pass uncertainty along with a value, and check how sensitive the next model is to that input.",
      steps: [
        {
          title: "Give the input a range",
          body: "A material property or migration barrier is rarely known as a perfectly exact number. A plausible range expresses what we know.",
        },
        {
          title: "Send different inputs through the model",
          body: "Try values across the range and observe how the output changes.",
        },
        {
          title: "Find what matters most",
          body: "Some small input changes produce large output changes. Improving these sensitive inputs can matter more than simply adding computation.",
        },
      ],
      tryThis:
        "Increase the spread in material stiffness and inspect the ranges of rod stiffness and extension. Then change the central Young's modulus.",
      notice:
        "A stiffer rod stretches less under the same force. Are the changes in these two outputs connected?",
      vocabulary: [
        {
          term: "Uncertainty",
          meaning: "How precisely we know a value or prediction.",
        },
        {
          term: "Sensitivity",
          meaning: "How strongly an output responds to a small input change.",
        },
        {
          term: "Error propagation",
          meaning:
            "The way input deviations affect outputs through a calculation.",
        },
      ],
    },
  },
  "electronic-structure": {
    zh: {
      question: "为什么同样由原子组成，有的材料导电，有的透明？",
      everyday:
        "铜线能导电，玻璃常常透明。原子的种类和排列很重要，电子能够处于哪些状态、怎样分布，也决定了许多材料性质。",
      takeaway:
        "电子结构研究电子允许处于什么状态、能量有多高，以及这些状态如何被占据。",
      steps: [
        {
          title: "把原子分成核与电子",
          body: "原子核带正电，电子带负电。相互吸引让电子与原子核组成原子。",
        },
        {
          title: "认识允许的状态",
          body: "电子不能任意选择能量。就像只能站在台阶上，允许的状态受到量子规则限制；台阶只是能量的类比。",
        },
        {
          title: "从原子走向材料",
          body: "许多原子靠近后，电子状态会相互影响，形成材料中的能带和成键方式。",
        },
      ],
      tryThis:
        "先比较孤立原子与许多原子靠近时的能级图，再去轨道章节观察空间分布。",
      notice:
        "能级图画的是允许的能量，轨道图画的是空间分布，两者回答不同的问题。",
      vocabulary: [
        { term: "电子", meaning: "带负电的粒子，参与成键和电流传导。" },
        { term: "能级", meaning: "量子系统允许具有的一个能量值。" },
        { term: "占据", meaning: "说明哪些允许状态里有电子。" },
      ],
    },
    en: {
      question:
        "Why do some materials conduct electricity while others are transparent?",
      everyday:
        "Copper wire carries current; ordinary glass is often transparent. Atomic species and arrangements matter, but many properties also depend on the states electrons can occupy and how electrons are distributed.",
      takeaway:
        "Electronic structure describes allowed electron states, their energies and how they are occupied.",
      steps: [
        {
          title: "Separate nuclei and electrons",
          body: "Nuclei carry positive charge and electrons negative charge. Their attraction allows atoms to form.",
        },
        {
          title: "Recognize allowed states",
          body: "Electrons cannot choose arbitrary energies. Steps on a staircase suggest allowed levels, although the staircase is only an energy analogy.",
        },
        {
          title: "Bring atoms together",
          body: "As many atoms approach, their electron states interact and form the bands and bonding patterns of a material.",
        },
      ],
      tryThis:
        "Compare energy-level diagrams for isolated and neighboring atoms, then visit the orbitals chapter to inspect their spatial distributions.",
      notice:
        "An energy-level diagram shows allowed energies. An orbital picture shows a spatial distribution. They answer different questions.",
      vocabulary: [
        {
          term: "Electron",
          meaning:
            "A negatively charged particle involved in bonding and electrical conduction.",
        },
        {
          term: "Energy level",
          meaning: "An energy value allowed for a quantum system.",
        },
        {
          term: "Occupation",
          meaning: "Which of the allowed states contain electrons.",
        },
      ],
    },
  },
  "atomic-orbitals": {
    zh: {
      question: "电子在原子里，到底“在哪里”？",
      everyday:
        "电子不是沿着一条画好的圆圈绕核运动。对许多同样的原子重复测量位置，会得到一个分布。轨道帮助我们描述这种分布的形状。",
      takeaway:
        "轨道展示量子状态的空间结构；电子出现的可能性由波函数的平方决定。",
      steps: [
        {
          title: "先看最简单的球形",
          body: "氢原子的 1s 状态没有偏好的方向。球形表示各方向相同，不表示电子只在球壳上。",
        },
        {
          title: "换一种状态看形状",
          body: "p 轨道有两个主要区域，d 轨道更丰富。两种颜色标记波函数的正负相位，不是正负电荷。",
        },
        {
          title: "用切片检查内部",
          body: "旋转和切片能揭示三维节点。铁的图形采用屏蔽核电荷近似，帮助认识轨道，不是完整铁原子的电子密度。",
        },
      ],
      tryThis: "从氢的 1s 切换到 2p，再观察铁的 3d；旋转图形，并移动剖面。",
      notice:
        "哪些方向能看到电子云，哪些平面是节点？点云表示位置概率，表面只是选定密度的边界。",
      vocabulary: [
        { term: "轨道", meaning: "描述一个电子空间量子状态的波函数。" },
        { term: "概率密度", meaning: "在某处附近发现电子的可能性有多集中。" },
        { term: "节点", meaning: "这个轨道的波函数为零的位置。" },
      ],
    },
    en: {
      question: "Where is an electron inside an atom?",
      everyday:
        "An electron does not follow a little circular track around the nucleus. Repeated position measurements on identically prepared atoms build up a distribution. An orbital describes the structure behind that distribution.",
      takeaway:
        "An orbital describes a quantum state's spatial structure. The squared wavefunction gives the probability density for finding an electron.",
      steps: [
        {
          title: "Start with a spherical state",
          body: "Hydrogen's 1s state has no preferred direction. Its spherical shape does not mean the electron sits only on a shell.",
        },
        {
          title: "Change the state",
          body: "A p orbital has two main lobes, while d orbitals have richer shapes. Two colors mark wavefunction phase, not positive and negative charge.",
        },
        {
          title: "Look inside with a slice",
          body: "Rotation and slices reveal three-dimensional nodes. The iron shapes use a screened-nucleus approximation, not a complete iron electron density.",
        },
      ],
      tryThis:
        "Switch from hydrogen 1s to 2p, then inspect iron 3d. Rotate the shape and move a slice through it.",
      notice:
        "Which directions contain the cloud, and which planes are nodes? Points sample position probability; a surface marks a chosen density threshold.",
      vocabulary: [
        {
          term: "Orbital",
          meaning:
            "A wavefunction describing an electron's spatial quantum state.",
        },
        {
          term: "Probability density",
          meaning:
            "How concentrated the chance of finding an electron is near a location.",
        },
        {
          term: "Node",
          meaning: "A location where this orbital's wavefunction is zero.",
        },
      ],
    },
  },
  bonding: {
    zh: {
      question: "为什么两个原子靠近后，有时会留在一起？",
      everyday:
        "原子靠近时，原来的电子分布会改变。如果新的安排降低了总能量，就可能形成稳定的结合。但继续压得太近，能量又会升高。",
      takeaway:
        "化学键来自电子与原子核共同形成的低能量安排；不同成键方式对应不同的电子分布。",
      steps: [
        {
          title: "看两个原子之间",
          body: "共价键中，电子状态可以跨越相邻原子，在它们之间形成共享的电子分布。",
        },
        {
          title: "再看许多原子一起",
          body: "金属中，一些电子状态延伸到许多原子上，而不是只局限于一对原子。",
        },
        {
          title: "找到合适的间距",
          body: "吸引与排斥共同决定稳定间距。像小球和弹簧的图能表示连接，却省略了电子本身。",
        },
      ],
      tryThis:
        "对照共价键和金属键示意图，寻找电子分布是集中于邻居之间，还是扩展到许多原子。",
      notice:
        "“共享电子”不意味着经典小球轮流属于两个原子，而是电子状态本身跨越了它们。",
      vocabulary: [
        { term: "共价键", meaning: "相邻原子通过共享电子状态形成的结合。" },
        {
          term: "金属键",
          meaning: "电子状态延展到许多原子、使金属整体稳定的一类结合。",
        },
        {
          term: "平衡间距",
          meaning: "在指定条件下，两原子结合能量最低附近的距离。",
        },
      ],
    },
    en: {
      question: "Why do two approaching atoms sometimes stay together?",
      everyday:
        "When atoms approach, their electron distributions change. If the new arrangement lowers the total energy, a stable bond can form. Push them too close and the energy rises again.",
      takeaway:
        "Bonding comes from low-energy arrangements of electrons and nuclei. Different bonding patterns involve different electron distributions.",
      steps: [
        {
          title: "Look between two atoms",
          body: "In covalent bonding, electron states can span neighboring atoms and create a shared distribution between them.",
        },
        {
          title: "Bring many atoms together",
          body: "In a metal, some electron states extend across many atoms instead of belonging to just one pair.",
        },
        {
          title: "Find a comfortable spacing",
          body: "Attraction and repulsion together determine a stable separation. Ball-and-spring pictures show connections but leave out the electrons.",
        },
      ],
      tryThis:
        "Compare the covalent and metallic bonding illustrations. Is the electron distribution concentrated between neighbors or spread across many atoms?",
      notice:
        "Sharing electrons does not mean a classical ball takes turns belonging to two atoms. The electron state itself spans them.",
      vocabulary: [
        {
          term: "Covalent bond",
          meaning:
            "A bond formed through electron states shared by neighboring atoms.",
        },
        {
          term: "Metallic bond",
          meaning:
            "Bonding in which electron states extending across many atoms help stabilize a metal.",
        },
        {
          term: "Equilibrium separation",
          meaning:
            "A separation near the minimum bonding energy under specified conditions.",
        },
      ],
    },
  },
  "band-structure": {
    zh: {
      question: "为什么有些材料里的电子容易移动，有些却很难？",
      everyday:
        "一个孤立原子有一些允许的电子能级。很多原子放在一起，这些能级形成成组的能带。电子能不能方便地进入附近的空状态，与导电性质有关。",
      takeaway: "带隙是两组允许能量之间的间隔；它不是原子之间的空间缝隙。",
      steps: [
        {
          title: "从能级变成能带",
          body: "许多原子互相影响后，原来少数能级变成大量密集的允许状态。",
        },
        {
          title: "区分已占据和空状态",
          body: "电子受到量子规则限制，不能任意挤进已经填满的状态。能带如何被填充很重要。",
        },
        {
          title: "查看两组状态间的间隔",
          body: "若占据态与上方空态之间有带隙，电子需要获得足够能量才能跨过去。实际导电性还受缺陷、温度等影响。",
        },
      ],
      tryThis: "在双原子链演示中，先让两种连接一样强，再逐渐拉开它们的差异。",
      notice:
        "两条能带之间是否出现间隔？图中的上下方向表示能量，不是电子在材料中的高度。",
      vocabulary: [
        { term: "能带", meaning: "晶体中一组密集的允许电子能量。" },
        { term: "带隙", meaning: "相邻能带之间没有允许状态的能量区间。" },
        { term: "费米能级", meaning: "用来描述电子填充状态的一条能量参考线。" },
      ],
    },
    en: {
      question:
        "Why can electrons move readily in some materials but not others?",
      everyday:
        "An isolated atom has allowed electron energy levels. Bring many atoms together and these levels form bands. Whether electrons can access nearby empty states matters for electrical conduction.",
      takeaway:
        "A band gap is a separation between allowed energy bands, not a physical gap between atoms.",
      steps: [
        {
          title: "Turn levels into bands",
          body: "When many atoms interact, a few isolated energy levels become large groups of closely spaced allowed states.",
        },
        {
          title: "Distinguish filled and empty states",
          body: "Quantum rules prevent electrons from simply crowding into already filled states. How bands are filled matters.",
        },
        {
          title: "Inspect the energy gap",
          body: "If a gap separates occupied states from empty states above, electrons need enough energy to cross it. Defects and temperature also affect conduction.",
        },
      ],
      tryThis:
        "In the two-atom chain demo, first make the two connections equally strong, then gradually make them different.",
      notice:
        "Does a gap open between the two bands? The vertical direction represents energy, not height inside the material.",
      vocabulary: [
        {
          term: "Band",
          meaning: "A dense group of allowed electron energies in a crystal.",
        },
        {
          term: "Band gap",
          meaning:
            "An energy interval between neighboring bands with no allowed states.",
        },
        {
          term: "Fermi level",
          meaning:
            "An energy reference used to describe the occupation of electron states.",
        },
      ],
    },
  },
  "formation-energy": {
    zh: {
      question: "两种元素放在一起，会愿意形成新材料吗？",
      everyday:
        "比较一道菜和分开放着的食材，需要先说清楚拿什么作参照。形成能也一样：比较某个材料与选定参考状态的能量，不能只看孤立的总能量数值。",
      takeaway:
        "形成能回答相对于指定参照是否降低了能量；是否稳定，还要比较其他可能的组合。",
      steps: [
        {
          title: "先选好参照",
          body: "例如用两种元素各自的稳定晶体作起点，记录它们原本的能量。",
        },
        {
          title: "比较形成材料后的能量",
          body: "如果新材料能量更低，形成能为负，说明它优于这组参照。",
        },
        {
          title: "再与其他组合比赛",
          body: "另一种化合物，或几种材料的混合，可能能量更低。图中的下边界帮助寻找这些更有利的组合。",
        },
      ],
      tryThis: "改变候选化合物的能量，观察它何时落到稳定性的下边界上。",
      notice: "一个点的形成能已经小于零，它是否仍可能位于另一种混合方案上方？",
      vocabulary: [
        { term: "参考态", meaning: "比较能量时约定的起点。" },
        { term: "形成能", meaning: "材料相对于指定组成和参考态的能量变化。" },
        {
          term: "凸包",
          meaning: "连接最低能量组合的下边界，用来判断谁可能稳定。",
        },
      ],
    },
    en: {
      question: "Will two elements prefer to form a new material?",
      everyday:
        "Comparing a prepared meal with separate ingredients requires a clear starting point. Formation energy also needs a reference: it compares a material with specified starting states, rather than using its total energy alone.",
      takeaway:
        "Formation energy says whether energy falls relative to chosen references. Stability also requires comparison with other possible combinations.",
      steps: [
        {
          title: "Choose the reference states",
          body: "For example, start with the stable crystal of each element and record their energies.",
        },
        {
          title: "Compare the new material",
          body: "If the material has lower energy, its formation energy is negative: it beats those references.",
        },
        {
          title: "Compare competing combinations",
          body: "Another compound or a mixture may still have lower energy. The lower boundary in the plot identifies favorable combinations.",
        },
      ],
      tryThis:
        "Change a candidate compound's energy and watch when it reaches the lower stability boundary.",
      notice:
        "Can a point have negative formation energy and still sit above a lower-energy mixture?",
      vocabulary: [
        {
          term: "Reference state",
          meaning: "The agreed starting state for an energy comparison.",
        },
        {
          term: "Formation energy",
          meaning:
            "The energy change relative to specified composition and reference states.",
        },
        {
          term: "Convex hull",
          meaning:
            "The lower boundary joining the lowest-energy combinations, used to assess stability.",
        },
      ],
    },
  },
};

export function getBeginner(id: LessonId, locale: Locale): BeginnerLesson {
  return lessons[id][locale];
}
