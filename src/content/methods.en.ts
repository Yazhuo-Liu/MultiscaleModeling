import type { Method } from "../types";

// Authored Markdown prose with LaTeX math; Python code stays verbatim.
export const methodsEn: Method[] = [
  {
    id: "dft",
    scale: "electronic",
    title: "Density Functional Theory",
    english: "Density Functional Theory",
    short: "DFT",
    tagline: "Read a material’s energy through its electron density.",
    description:
      "Use the electron density in ordinary space, rather than a high-dimensional many-electron wavefunction, to study bonding, structural stability and material properties.",
    length: "Å – nm",
    time: "Usually a ground state; dynamics may reach fs",
    difficulty: "Quantum foundations",
    prerequisites: [
      "Energy minimization",
      "Wavefunctions and probability",
      "Derivatives",
    ],
    intuition:
      "Imagine an electron cloud around a nucleus that can change its shape. Squeezing it too tightly raises its kinetic energy; spreading it too far weakens the attraction to the nucleus. DFT seeks the density that minimizes the total energy. Its goal is not to draw a separate trajectory for each electron.",
    concepts: [
      {
        title: "01 · From particles to density",
        body: "The electron density $n(\\mathbf r)$ is the mean number of electrons per unit volume. Its normalization is $\\int n(\\mathbf r)\\,\\mathrm d\\mathbf r=N$, where $N$ is the total electron number. The Hohenberg–Kohn theorems connect the ground-state density to ground-state properties, but do not supply a practical expression for the exact energy functional.",
      },
      {
        title: "02 · The Kohn–Sham auxiliary system",
        body: "A set of fictitious noninteracting orbitals reproduces the physical electron density. These orbitals provide the main kinetic-energy contribution; the remaining many-body effects enter the exchange–correlation functional. In practice, orbitals and density are repeatedly updated until they are self-consistent.",
      },
      {
        title: "03 · Approximations determine predictive power",
        body: "LDA, GGA and hybrid functionals offer different balances of accuracy and cost. Plane-wave cutoffs, $\\mathbf k$-point meshes, pseudopotentials, geometry optimization and self-consistency tolerances all need convergence checks. Ground-state DFT itself does not advance a physical clock.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}E[n] &= T_{\\mathrm s}[n]+\\int v_{\\mathrm{ext}}(\\mathbf r)n(\\mathbf r)\\,\\mathrm d\\mathbf r \\\\ &\\quad + E_{\\mathrm H}[n]+E_{\\mathrm{xc}}[n]\\end{aligned}",
      explanation:
        "$T_{\\mathrm s}$ is the auxiliary-system kinetic energy, $v_{\\mathrm{ext}}$ the external potential, $E_{\\mathrm H}$ the classical Coulomb energy and $E_{\\mathrm{xc}}$ the remaining exchange–correlation energy. Among densities satisfying $\\int n(\\mathbf r)\\,\\mathrm d\\mathbf r=N$, the ground state minimizes the energy.",
    },
    steps: [
      "Specify the atomic structure, electron number and boundary conditions.",
      "Choose the basis, pseudopotentials and exchange–correlation approximation; construct an initial density.",
      "Solve the Kohn–Sham equations, rebuild the density from occupied orbitals and mix the update.",
      "Check convergence of energy and density before comparing structures or calculating forces.",
    ],
    code: '# Teaching example: one Gaussian orbital for hydrogen; not full DFT\nimport numpy as np\nalpha = np.linspace(0.05, 2.0, 500)\n# Atomic units: hbar = m_e = e = 4*pi*epsilon_0 = 1\nenergy = 1.5 * alpha - 2 * np.sqrt(2 * alpha / np.pi)\ni = np.argmin(energy)\nr = np.linspace(0, 4, 200)\ndensity = (2 * alpha[i] / np.pi)**1.5 * np.exp(-2 * alpha[i] * r*r)\nprint("Optimal alpha:", alpha[i], "Energy / Hartree:", energy[i])\nprint("The exact hydrogen ground state is -0.5 Hartree; a Gaussian trial gives an upper bound.")',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Find the right width for an electron cloud",
      description:
        "Minimize the energy of a Gaussian trial density for a one-electron, hydrogen-like atom. Change the nuclear charge $Z$ and initial Gaussian exponent $\\alpha$ to observe the radial probability distribution and optimization.",
      observe: [
        "Change the initial Gaussian exponent. Does optimization approach the same energy minimum?",
        "As nuclear charge increases, does the radial-probability peak move closer to the nucleus?",
        "At $Z=1$, compare the optimized variational energy with the exact hydrogen ground state, $-0.5\\,\\mathrm{Hartree}$. A single Gaussian cannot represent the exact orbital.",
      ],
      limitations:
        "This is a one-electron variational teaching model. It does not solve many-electron Kohn–Sham equations or include a real material’s exchange–correlation physics, lattice or band structure. Iterations are not physical time.",
    },
    applications: [
      "Stable crystal structures and relative energies",
      "Defect formation energies and surface adsorption",
      "Input data for interatomic potentials and elastic constants",
    ],
    limitations: [
      "Approximate functionals may misrepresent strong correlation and weak interactions.",
      "System size, the basis and $\\mathbf k$-point sampling determine the computational cost.",
      "A static ground-state calculation does not directly describe diffusion over seconds.",
    ],
    connections: [
      {
        id: "hf",
        reason:
          "Compare the treatment of exchange and the omission or approximation of electron correlation.",
      },
      {
        id: "md",
        reason:
          "Differentiating energy with respect to atomic positions gives forces. First-principles MD invokes an electronic-structure calculation at each step.",
      },
    ],
    references: [
      {
        title: "Density Functional Theory: A Practical Introduction",
        author: "D. Sholl & J. A. Steckel",
        url: "https://doi.org/10.1002/9780470447710",
      },
      {
        title:
          "Self-Consistent Equations Including Exchange and Correlation Effects",
        author: "W. Kohn & L. J. Sham (1965)",
        url: "https://doi.org/10.1103/PhysRev.140.A1133",
      },
    ],
  },
  {
    id: "hf",
    scale: "electronic",
    title: "Hartree–Fock Method",
    english: "Hartree–Fock Method",
    short: "HF",
    tagline: "Each electron experiences the average field of the others.",
    description:
      "Start from a many-electron wavefunction and use a single Slater determinant to enforce antisymmetry, giving a mean-field electronic-structure method that can be solved self-consistently.",
    length: "Å – nm",
    time: "Ground-state iterations; no intrinsic timescale",
    difficulty: "Quantum foundations",
    prerequisites: [
      "Linear algebra",
      "Electron orbitals",
      "Pauli exclusion principle",
    ],
    intuition:
      "Electrons repel one another, so describing every pair simultaneously is difficult. Let each electron move in the average field of the others, then update the orbitals until they agree with that field. Unlike a purely classical averaged charge, HF also retains quantum constraints through exchange, which follows from indistinguishability.",
    concepts: [
      {
        title: "01 · Build a wavefunction from orbitals",
        body: "Place occupied spin orbitals in a Slater determinant. Exchanging two electrons changes the sign of the wavefunction, automatically satisfying fermionic antisymmetry. Restricting the wavefunction to one determinant is the central HF approximation.",
      },
      {
        title: "02 · Coulomb and exchange terms",
        body: "The Fock operator contains one-electron, Coulomb and exchange terms. The Coulomb term represents mean electrostatic repulsion. Exchange follows from antisymmetry and acts between same-spin electrons; it is not an additional classical force.",
      },
      {
        title: "03 · Self-consistency and correlation",
        body: "The orbitals determine the density matrix, which changes the Fock matrix, so self-consistent-field (SCF) iteration is required. HF is variationally optimal within the chosen basis and single-determinant space, but omits electronic correlation beyond that approximation.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}\\mathbf F\\mathbf C &= \\mathbf S\\mathbf C\\boldsymbol{\\varepsilon} \\\\ \\mathbf F &= \\mathbf h+\\mathbf J-\\mathbf K\\end{aligned}",
      explanation:
        "$\\mathbf C$ contains orbital coefficients, $\\mathbf S$ is the basis overlap matrix and $\\boldsymbol\\varepsilon$ contains orbital energies. Coefficients in $\\mathbf J$ and $\\mathbf K$ depend on whether spin-orbital or closed-shell spatial-orbital conventions are used. The experiment uses a simplified orthogonal basis.",
    },
    steps: [
      "Choose basis functions and compute one- and two-electron integrals.",
      "Construct a density matrix from an initial orbital guess.",
      "Build and diagonalize the Fock matrix; occupy orbitals for the required electron number.",
      "Mix old and new densities until converged, then check total energy and spin state.",
    ],
    code: '# Two-site Hubbard restricted Hartree-Fock, 2 electrons; energy unit t=1\nimport numpy as np\nU, bias, mix = 2.0, 1.0, 0.25\nh = np.array([[-bias/2, -1.0], [-1.0, bias/2]])\np = np.eye(2)\nfor iteration in range(300):\n    # Opposite-spin occupation gives U*n_i/2; not a general molecular integral expression\n    f = h + 0.5*U*np.diag(np.diag(p))\n    eps, c = np.linalg.eigh(f)\n    p_new = 2*np.outer(c[:,0],c[:,0])\n    error = np.linalg.norm(p_new-p)\n    p = (1-mix)*p + mix*p_new\n    if error < 1e-9: break\nprint("Occupations:", np.diag(p), "Total electrons:", np.trace(p))\nprint("SCF residual:", error)',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Watch a mean field become self-consistent",
      description:
        "Use restricted Hartree–Fock for a two-site Hubbard model containing two electrons of opposite spin. Adjust the on-site repulsion $U/t$ and site-energy difference $\\Delta/t$, then observe occupations and the SCF residual.",
      observe: [
        "As the site-energy difference increases, which site do the electrons prefer?",
        "Does stronger on-site repulsion make the two site occupations more balanced?",
        "Watch the self-consistency residual decrease while the total occupation remains exactly two electrons.",
      ],
      limitations:
        "This is a restricted-HF mean-field model of a two-site Hubbard system. Two opposite-spin electrons occupy one spatial orbital, with a simplified on-site interaction. It does not use molecular two-electron integrals and is not an ab initio molecular HF calculation. Iteration count has no physical-time interpretation.",
    },
    applications: [
      "An introduction to molecular orbitals and chemical bonding",
      "Reference states for post-HF correlation methods",
      "A baseline for exchange and mean-field approximations",
    ],
    limitations: [
      "One determinant may fail near bond breaking and in strongly correlated systems.",
      "Missing dynamical correlation usually prevents an accurate description of dispersion.",
      "Convergence to a solution does not guarantee the lowest-energy electronic state.",
    ],
    connections: [
      {
        id: "dft",
        reason:
          "Both often use SCF iteration. HF starts from a wavefunction, whereas DFT starts from a density and its energy functional.",
      },
      {
        id: "md",
        reason:
          "An electronic potential-energy surface supplies forces for atomic motion.",
      },
    ],
    references: [
      {
        title: "Modern Quantum Chemistry",
        author: "A. Szabo & N. S. Ostlund",
        url: "https://store.doverpublications.com/products/9780486691862",
      },
      {
        title: "Psi4: Self-Consistent Field Theory",
        author: "Psi4 documentation",
        url: "https://psicode.org/psi4manual/master/scf.html",
      },
    ],
  },
  {
    id: "md",
    scale: "atomistic",
    title: "Molecular Dynamics",
    english: "Molecular Dynamics",
    short: "MD",
    tagline: "Let atoms obey Newton’s laws and watch matter move.",
    description:
      "Integrate particle trajectories for a specified interatomic interaction, connecting microscopic motion with temperature, pressure, diffusion and other macroscopic observables.",
    length: "nm – μm",
    time: "fs timesteps; ps–μs trajectories",
    difficulty: "Foundation",
    prerequisites: [
      "Newton’s second law",
      "Potential energy and forces",
      "Basic numerical integration",
    ],
    intuition:
      "Think of atoms as small objects that attract at moderate separation but repel strongly when pushed too close. If their positions and velocities are known, the forces predict their state a very short time later. Repeating this calculation produces a trajectory.",
    concepts: [
      {
        title: "01 · Potential energy gives the forces",
        body: "The total potential energy $U(\\mathbf r_1,\\ldots,\\mathbf r_N)$ assigns an energy to an atomic configuration, with force $\\mathbf F_i=-\\nabla_i U$. The Lennard–Jones pair potential $U_{\\mathrm{LJ}}(r)$ illustrates repulsion and attraction, but is not a universal model of metallic bonding, covalent bonding or chemical reactions.",
      },
      {
        title: "02 · Integration and timestep",
        body: "Velocity Verlet updates positions using the old forces, then updates velocities using both old and new forces. The timestep must resolve the fastest relevant vibrations. A visually stable animation alone does not establish adequate numerical accuracy.",
      },
      {
        title: "03 · Statistics require sampling",
        body: "Temperature follows from kinetic energy after removing collective motion; pressure depends on momentum transport and interactions. Equilibrate first, then sample a trajectory long compared with relevant correlation times and examine size and timestep sensitivity.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}m_i\\ddot{\\mathbf r}_i &= -\\nabla_i U \\\\ U_{\\mathrm{LJ}}(r) &= 4\\varepsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12}-\\left(\\frac{\\sigma}{r}\\right)^6\\right]\\end{aligned}",
      explanation:
        "$\\varepsilon$ sets the energy scale and $\\sigma$ the length scale. In LJ reduced units, $m=\\varepsilon=\\sigma=1$, and the time unit is $\\tau_{\\mathrm{LJ}}=\\sigma\\sqrt{m/\\varepsilon}$. Animation speed is not a physical timescale.",
    },
    steps: [
      "Initialize particle positions and velocities and remove overall drift.",
      "Evaluate pair forces and impose the boundary conditions.",
      "Update positions and velocities with velocity Verlet.",
      "Record kinetic energy, potential energy and structure; test energy drift and timestep convergence.",
    ],
    code: '# 1D LJ diatomic vibration: reduced units, velocity Verlet\nimport numpy as np\nx = np.array([-0.6, 0.6]); v = np.zeros(2)\ndt = 0.002\ndef force(x):\n    r = x[1] - x[0]\n    magnitude = 24 * (2/r**13 - 1/r**7)\n    return np.array([-magnitude, magnitude])\nf = force(x)\nfor _ in range(2000):\n    x += v*dt + 0.5*f*dt**2\n    f_new = force(x)\n    v += 0.5*(f + f_new)*dt\n    f = f_new\nr = x[1] - x[0]\nprint("Separation:", r, "Total energy:", 0.5*np.sum(v*v) + 4*(r**-12-r**-6))',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Watch Lennard–Jones particles move",
      description:
        "Change the initial reduced temperature or two-dimensional number density. Switch between a 2D particle plot and a rotatable 3D view to examine local structure and thermal motion.",
      observe: [
        "At low initial temperature, do particles retain a recognizable near-neighbor structure?",
        "Increase the initial kinetic energy and compare the amplitude of particle motion.",
        "Track energy changes and distinguish physical exchange between kinetic and potential energy from numerical drift.",
      ],
      limitations:
        "A finite-particle model with a simplified potential and teaching boundary conditions. It does not represent a particular material. Converting reduced temperature and time requires material parameters; a 3D display does not turn the planar model into a fully three-dimensional molecular simulation.",
    },
    applications: [
      "Atomic diffusion and heat transport",
      "Crack-tip processes and deformation of nanomaterials",
      "Liquid structure and mechanisms of phase transitions",
    ],
    limitations: [
      "Timesteps are limited by atomic vibrations, making direct simulation over seconds difficult.",
      "Results depend on the potential’s reliability for the material and state of interest.",
      "Small systems and short trajectories produce finite-size and sampling errors.",
    ],
    connections: [
      {
        id: "dft",
        reason:
          "Electronic-structure calculations can parameterize interatomic potentials or provide forces directly.",
      },
      {
        id: "kmc",
        reason:
          "Extract rates for rare diffusion events to reach timescales that ordinary MD cannot access.",
      },
    ],
    references: [
      {
        title: "Computer Simulation of Liquids",
        author: "M. P. Allen & D. J. Tildesley",
        url: "https://doi.org/10.1093/oso/9780198803195.001.0001",
      },
      {
        title: "LAMMPS documentation",
        author: "LAMMPS developers",
        url: "https://docs.lammps.org/Manual.html",
      },
    ],
  },
  {
    id: "mc",
    scale: "atomistic",
    title: "Monte Carlo",
    english: "Monte Carlo",
    short: "MC",
    tagline: "Use random trials to uncover equilibrium statistics.",
    description:
      "Accept or reject random changes according to a target probability distribution to estimate energy, magnetization, phase transitions and other thermodynamic observables.",
    length: "Å – μm (model dependent)",
    time: "Sampling steps, not physical time",
    difficulty: "Foundation",
    prerequisites: ["Probability", "Energy", "Exponential functions"],
    intuition:
      "Instead of tracing the true path of every particle, ask which states a system visits most often at equilibrium. Monte Carlo proposes small changes repeatedly. Moves that lower energy are usually accepted; some energy-increasing moves are accepted too, with temperature controlling how often that happens.",
    concepts: [
      {
        title: "01 · Sampling is not a trajectory",
        body: "A common target is the canonical Boltzmann distribution. The sequence of Markov-chain states is a sampling device; a spin-flip attempt is not a physical second or an atomic vibration.",
      },
      {
        title: "02 · The Metropolis acceptance rule",
        body: "For symmetric proposals, accept energy-lowering moves and accept an increase $\\Delta E>0$ with probability $\\exp[-\\Delta E/(k_{\\mathrm B}T)]$. More general proposal distributions require a Metropolis–Hastings correction.",
      },
      {
        title: "03 · Equilibration and uncertainty",
        body: "The initial configuration biases early results, so discard an equilibration period. Successive samples are often correlated, particularly near a critical point. Estimate autocorrelation, error bars and finite-size effects.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}P_{\\mathrm{accept}} &= \\min\\left[1,\\exp\\left(-\\frac{\\Delta E}{k_{\\mathrm B}T}\\right)\\right] \\\\ H &= -J\\sum_{\\langle i,j\\rangle}s_i s_j-h\\sum_i s_i\\end{aligned}",
      explanation:
        "In the Ising model, $s_i=\\pm1$ and $J>0$ favors neighboring spins pointing the same way. The coefficient $h$ is the external-field energy per spin; $h=0$ means zero field. The experiment uses a periodic two-dimensional lattice and the dimensionless temperature $k_{\\mathrm B}T/J$. The code example uses zero field.",
    },
    steps: [
      "Initialize the spin lattice and select a temperature.",
      "Select a spin at random and calculate the energy change for flipping it.",
      "Accept or reject the move with the Metropolis rule.",
      "After equilibration, sample magnetization and energy and assess statistical uncertainty.",
    ],
    code: '# 2D Ising, periodic boundaries; one sweep = N*N attempted flips\nimport numpy as np\nrng = np.random.default_rng(7)\nn, temperature = 24, 2.0\ns = rng.choice([-1, 1], size=(n, n))\nfor _ in range(400*n*n):\n    i, j = rng.integers(n, size=2)\n    neighbors = s[(i+1)%n,j]+s[(i-1)%n,j]+s[i,(j+1)%n]+s[i,(j-1)%n]\n    dE = 2*s[i,j]*neighbors\n    if dE <= 0 or rng.random() < np.exp(-dE/temperature):\n        s[i,j] *= -1\nprint("Final magnetization / spin:", s.mean())\n# One final state is not a reliable ensemble average; equilibrate, sample and estimate errors.',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Watch magnetic domains emerge from randomness",
      description:
        "Apply Metropolis updates to a two-dimensional Ising spin lattice. Vary temperature to compare aligned domains with a disordered state.",
      observe: [
        "At low temperature, do large aligned regions gradually form?",
        "Why does magnetization approach zero at high temperature while still fluctuating?",
        "The infinite square-lattice, zero-field Ising model has a critical temperature of about $T_{\\mathrm c}\\approx2.269\\,J/k_{\\mathrm B}$. A small system rounds off this transition.",
      ],
      limitations:
        "The animation shows Monte Carlo sampling without a calibrated physical clock. A finite lattice and short sampling period are insufficient for a precise determination of critical exponents.",
    },
    applications: [
      "Equilibrium phase transitions and magnetism",
      "Alloy configurations and adsorption statistics",
      "Free energies and probabilistic integration",
    ],
    limitations: [
      "Ordinary Metropolis MC does not provide real dynamics.",
      "Low temperature and energy barriers can trap the sampler.",
      "Equilibration, autocorrelation and statistical errors must be checked.",
    ],
    connections: [
      {
        id: "kmc",
        reason:
          "KMC advances a clock using physical event rates; equilibrium MC primarily generates a target distribution.",
      },
      {
        id: "phase-field",
        reason:
          "Both can display evolving patterns, but use different variables, time interpretations and evolution laws.",
      },
    ],
    references: [
      {
        title: "Equation of State Calculations by Fast Computing Machines",
        author: "N. Metropolis et al. (1953)",
        url: "https://doi.org/10.1063/1.1699114",
      },
      {
        title: "Monte Carlo Methods in Statistical Physics",
        author: "M. E. J. Newman & G. T. Barkema",
        url: "https://global.oup.com/academic/product/monte-carlo-methods-in-statistical-physics-9780198517979",
      },
    ],
  },
  {
    id: "dd",
    scale: "mesoscopic",
    title: "Dislocation Dynamics",
    english: "Dislocation Dynamics",
    short: "DD",
    tagline: "Follow defect lines instead of tracking every atom.",
    description:
      "Represent dislocations as lines or discrete segments, and use stress-driven forces and mobility laws to describe plastic deformation.",
    length: "nm – μm",
    time: "ns–ms, depending on mobility",
    difficulty: "Intermediate",
    prerequisites: ["Elasticity and shear stress", "Crystal slip", "Vectors"],
    intuition:
      "Sliding an entire carpet is difficult, but moving a wrinkle lets the carpet advance gradually. A dislocation acts like a wrinkle in a crystal: as the line sweeps through it, the two sides slip by one Burgers vector. Plastic deformation can therefore occur far below the ideal shear strength.",
    concepts: [
      {
        title: "01 · Line defects carry plasticity",
        body: "The Burgers vector $\\mathbf b$ measures the closure failure associated with a dislocation, and the unit line direction $\\boldsymbol\\xi$ describes its orientation. Edge, screw and mixed dislocations have different geometric relationships. Glide is usually constrained to crystallographic planes.",
      },
      {
        title: "02 · Stress drives dislocation motion",
        body: "The Peach–Koehler force relates the stress tensor, Burgers vector and line direction. Long-range elastic interactions with other dislocations, applied stresses and obstacles together determine the net driving force.",
      },
      {
        title: "03 · From line motion to strain",
        body: "The area swept by a dislocation translates into plastic shear. More complete DD models must treat line tension, cross-slip, reactions, annihilation and junction topology. These features are not all present in a teaching model.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}\\mathbf f_{\\mathrm{PK}} &= (\\boldsymbol{\\sigma}\\cdot\\mathbf b)\\times\\boldsymbol{\\xi} \\\\ v &= Mf \\\\ \\dot\\gamma &= \\rho_{\\mathrm m}b\\bar v\\end{aligned}",
      explanation:
        "$\\mathbf f_{\\mathrm{PK}}$ is force per unit line length and $M$ is mobility; $v=Mf$ is a scalar law along an allowed glide direction. Orowan’s relation connects mobile dislocation density $\\rho_{\\mathrm m}$, Burgers-vector magnitude $b=|\\mathbf b|$ and mean speed $\\bar v$ to plastic shear-strain rate $\\dot\\gamma$.",
    },
    steps: [
      "Specify slip planes, dislocation positions and signs.",
      "Calculate the resolved shear stresses from external loading and other dislocations.",
      "Obtain velocities from a mobility law and update with sufficiently small timesteps.",
      "Handle boundaries and reactions; accumulate plastic strain from swept area.",
    ],
    code: '# Pinned dislocation, small-slope model: dy/dt = stress + tension*d2y/dx2\nimport numpy as np\nn, tension, stress = 65, 1.0, 0.6\nx = np.linspace(0,1,n); dx = x[1]-x[0]\ny = np.zeros(n); dt = 0.2*dx*dx/tension\nfor _ in range(6000):\n    lap = (y[2:]-2*y[1:-1]+y[:-2])/dx**2\n    y[1:-1] += dt*(stress+tension*lap)\n    # Keep both endpoints at y=0; reduced mobility M=1\nexact = stress*x*(1-x)/(2*tension)\nprint("Maximum bow-out:", y.max(), "Static limit:", exact.max())',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "How a pinned dislocation bows out",
      description:
        "A dislocation segment with fixed ends bends under shear stress while line tension tries to straighten it. Adjust the driving stress and line tension to inspect the equilibrium bowing shape.",
      observe: [
        "How does the maximum bow-out change as shear stress increases?",
        "Does greater line tension make the dislocation harder to bend?",
        "The experiment normalizes line length to $1$. Compare its maximum bow-out with $\\hat y_{\\max}=\\hat\\tau/(8\\hat\\Gamma)$; the dimensional model gives $y_{\\max}=\\tau bL^2/(8\\Gamma)$. This model does not emit dislocation loops.",
      ],
      limitations:
        "A two-dimensional, overdamped, small-slope model with constant line tension and fixed endpoints. It omits dislocation interactions, topology changes, climb and cross-slip. Large slopes invalidate the approximation; it cannot quantitatively predict a Frank–Read source’s critical stress.",
    },
    applications: [
      "Micrometer-scale plasticity and size effects",
      "Dislocation pile-ups and obstacle strengthening",
      "Input for hardening laws in crystal plasticity",
    ],
    limitations: [
      "Continuum elasticity does not resolve the dislocation core accurately.",
      "Full network reactions and free-surface treatment are complex.",
      "Mobility laws and material parameters must come from experiment or finer-scale models.",
    ],
    connections: [
      {
        id: "md",
        reason:
          "Atomistic simulations can reveal dislocation core structures and mobilities.",
      },
      {
        id: "crystal-plasticity",
        reason:
          "Dislocation density and motion inform slip and hardening laws.",
      },
    ],
    references: [
      {
        title:
          "Forces Exerted on Dislocations and the Stress Fields Produced by Them",
        author: "M. Peach & J. S. Koehler (1950)",
        url: "https://doi.org/10.1103/PhysRev.80.436",
      },
      {
        title: "Computer Simulations of Dislocations",
        author: "V. V. Bulatov & W. Cai",
        url: "https://doi.org/10.1093/oso/9780198526148.001.0001",
      },
    ],
  },
  {
    id: "kmc",
    scale: "mesoscopic",
    title: "Kinetic Monte Carlo",
    english: "Kinetic Monte Carlo",
    short: "KMC",
    tagline: "Skip uneventful waiting and jump to the next event.",
    description:
      "Describe thermally activated processes as discrete events. Their rates determine what happens next and when, allowing the model to move beyond atomic-vibration timescales.",
    length: "nm – μm",
    time: "ns–s or longer, depending on rates",
    difficulty: "Intermediate",
    prerequisites: [
      "Probability distributions",
      "Thermal activation",
      "Random numbers",
    ],
    intuition:
      "A diffusing atom spends most of its time vibrating near a lattice site and only occasionally crosses an energy barrier. KMC compresses this waiting into a random time interval and simulates the next jump directly. With a suitable event catalog and rates, it efficiently describes rare events.",
    concepts: [
      {
        title: "01 · Events and barriers",
        body: "List the hops, reactions or adsorption events available in the current state. A common choice is the Arrhenius rate $k=\\nu\\exp[-E_{\\mathrm a}/(k_{\\mathrm B}T)]$, where $\\nu$ is an attempt frequency and $E_{\\mathrm a}$ is the activation energy.",
      },
      {
        title: "02 · Competing clocks",
        body: "The sum of all event rates is R. Event i is selected with probability kᵢ/R. Its waiting time follows an exponential distribution with rate R and mean 1/R.",
      },
      {
        title: "03 · Assumptions behind the effective model",
        body: "A usual assumption is rapid equilibration within a metastable state, approximately memoryless transitions and a sufficiently complete event catalog. Missing a low-barrier mechanism can matter much more than random sampling error.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}k_i &= \\nu_i\\exp\\left(-\\frac{E_i}{k_{\\mathrm B}T}\\right) \\\\ R &= \\sum_i k_i,\\qquad \\Delta t=-\\frac{\\ln u}{R}\\end{aligned}",
      explanation:
        "$u$ is uniformly distributed on $(0,1)$ and $R$ is the total rate of all currently available events. Use a second, independent random number to select the event. If $k_i$ has units of $\\mathrm{s}^{-1}$, the accumulated time is in seconds.",
    },
    steps: [
      "List all permitted events and their rates for the current configuration.",
      "Sample the next event from cumulative rates.",
      "Sample an exponential waiting time and advance the physical clock.",
      "Execute the event, update the affected event list and repeat.",
    ],
    code: '# 1D nearest-neighbor activated diffusion; distance in lattice spacings\nimport numpy as np\nrng = np.random.default_rng(12)\nkB, temperature = 8.617333262e-5, 500.0  # eV/K, K\nbarrier, attempt = 0.5, 1e12             # eV, s^-1\nk = attempt*np.exp(-barrier/(kB*temperature))\nx, time = 0, 0.0\nfor _ in range(10000):\n    time += -np.log(max(rng.random(), 1e-15))/(2*k)\n    x += 1 if rng.random() < 0.5 else -1\nprint("Displacement / lattice spacing:", x, "Physical time / s:", time)\nprint("1D theoretical diffusivity / a^2/s:", k)',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "The clock behind vacancy hops",
      description:
        "Watch one vacancy hop on a periodic square lattice. Adjust temperature and migration barrier to compare the physical waiting time for the same number of hops; the orange point marks the vacancy.",
      observe: [
        "How does a single waiting time change when temperature rises?",
        "Increasing the barrier may leave a path looking similar while changing its physical clock by orders of magnitude.",
        "Distinguish a single random trajectory from diffusion averaged over many particles or realizations.",
      ],
      limitations:
        "The model uses a fixed lattice and prescribed Arrhenius rates, without dynamic reconstruction or complex interactions. Its physical-time interpretation is valid only for the chosen rate model.",
    },
    applications: [
      "Vacancy and surface diffusion",
      "Thin-film growth and adsorption reactions",
      "Long-term defect aggregation and aging",
    ],
    limitations: [
      "An adequately complete event catalog must already be known.",
      "Rates depend on accurate barriers, attempt frequencies and temperatures.",
      "Rapidly repeated events can still become a computational bottleneck.",
    ],
    connections: [
      {
        id: "md",
        reason:
          "MD and transition-state methods help identify events and migration mechanisms.",
      },
      {
        id: "mc",
        reason:
          "Compare equilibrium sampling with event-driven dynamics carrying a physical clock.",
      },
    ],
    references: [
      {
        title: "Introduction to the Kinetic Monte Carlo Method",
        author: "A. F. Voter (2007)",
        url: "https://doi.org/10.1007/978-1-4020-5295-8_1",
      },
      {
        title:
          "A new algorithm for Monte Carlo simulation of Ising spin systems",
        author: "A. B. Bortz, M. H. Kalos & J. L. Lebowitz (1975)",
        url: "https://doi.org/10.1016/0021-9991(75)90060-1",
      },
    ],
  },
  {
    id: "phase-field",
    scale: "microstructure",
    title: "Phase-field Method",
    english: "Phase-field Method",
    short: "PF",
    tagline: "Let interfaces emerge naturally from a continuous field.",
    description:
      "Represent phases or microstructure with smoothly varying order parameters, then use free-energy-driven partial differential equations to describe interface motion and evolving morphology.",
    length: "nm – mm",
    time: "μs–h, depending on physical parameters",
    difficulty: "Intermediate",
    prerequisites: [
      "Derivatives and gradients",
      "Free energy",
      "Diffusion equations",
    ],
    intuition:
      "You do not have to trace a complicated boundary at every instant. Assign a number to each position: values near +1 describe one phase, values near −1 another, and a smooth transition separates them. As the field evolves to lower free energy, interfaces move, merge and disappear.",
    concepts: [
      {
        title: "01 · A diffuse interface",
        body: "An order parameter $\\phi$ turns a discrete phase label into a continuous variable. A double-well potential stabilizes two phases while gradient energy penalizes sharp spatial variation. Together they set the interface thickness and energy.",
      },
      {
        title: "02 · Ask whether the variable is conserved",
        body: "Allen–Cahn dynamics describes a nonconserved order parameter, allowing phase fractions to change. Cahn–Hilliard dynamics describes a conserved concentration field, transporting material down chemical-potential gradients. The two cannot be interchanged arbitrarily.",
      },
      {
        title: "03 · Free energy and kinetics",
        body: "Free energy may couple temperature, stress, elasticity and multicomponent chemistry. Interface thickness, mesh spacing, timestep and mobility require consistent calibration. An attractive pattern is not automatically a quantitative prediction.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}F[\\phi] &= \\int\\left[\\frac14(\\phi^2-1)^2+\\frac\\kappa2|\\nabla\\phi|^2\\right]\\,\\mathrm dV \\\\ \\frac{\\partial\\phi}{\\partial t} &= -M\\frac{\\delta F}{\\delta\\phi}\\end{aligned}",
      explanation:
        "The experiment uses Allen–Cahn dynamics: $\\partial_t\\phi=M[\\kappa\\nabla^2\\phi-(\\phi^3-\\phi)]$. Here $M>0$ is mobility and $\\kappa>0$ is the gradient-energy coefficient. With periodic boundaries, the continuum model decreases free energy.",
    },
    steps: [
      "Choose the order parameter, free energy and conservation properties.",
      "Set the initial microstructure and boundary conditions.",
      "Discretize the Laplacian and update the order parameter.",
      "Check free energy, interface resolution and timestep sensitivity.",
    ],
    code: '# Dimensionless Allen-Cahn, 2D periodic boundaries; dx=1\nimport numpy as np\nrng = np.random.default_rng(5)\nphi = 0.1*rng.standard_normal((48, 48))\nkappa, mobility, dt = 1.0, 1.0, 0.05\nfor _ in range(400):\n    lap = sum(np.roll(phi,s,axis=a) for a in (0,1) for s in (-1,1))-4*phi\n    phi += dt*mobility*(kappa*lap-phi**3+phi)\nprint("Order-parameter range:", phi.min(), phi.max())\nprint("Mean order parameter:", phi.mean(), "(not conserved in this model)")',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Watch small domains shrink and large domains grow",
      description:
        "Evolve an Allen–Cahn field from small random perturbations and observe the emerging pattern and curvature-driven interface motion.",
      observe: [
        "Why do small regions often disappear first?",
        "Change mobility to distinguish the speed of evolution from the free-energy minimum.",
        "In the 3D height view, inspect smooth interfaces. Height represents the order parameter, not the material’s physical surface.",
      ],
      limitations:
        "A two-dimensional, nonconserved scalar field with a dimensionless double-well free energy. It is not conserved-composition Cahn–Hilliard decomposition and includes neither calibrated material parameters nor polycrystal orientations.",
    },
    applications: [
      "Solidification dendrites and phase transformations",
      "Grain growth and domain-wall motion",
      "Diffuse-interface descriptions of cracks and damage",
    ],
    limitations: [
      "The model must match the relevant conservation laws and physical mechanisms.",
      "Several grid points must resolve the interface thickness.",
      "Quantitative predictions require calibrated free energies and kinetic parameters.",
    ],
    connections: [
      {
        id: "fdm",
        reason:
          "Finite differences are a common way to discretize phase-field evolution equations.",
      },
      {
        id: "dft",
        reason:
          "Electronic-structure and thermodynamic data can help construct free energies.",
      },
    ],
    references: [
      {
        title: "Phase-Field Models for Microstructure Evolution",
        author: "L.-Q. Chen (2002)",
        url: "https://doi.org/10.1146/annurev.matsci.32.112001.132041",
      },
      {
        title: "A microscopic theory for antiphase boundary motion",
        author: "S. M. Allen & J. W. Cahn (1979)",
        url: "https://doi.org/10.1016/0001-6160(79)90196-2",
      },
    ],
  },
  {
    id: "crystal-plasticity",
    scale: "microstructure",
    title: "Polycrystal Plasticity",
    english: "Polycrystal Plasticity",
    short: "CP",
    tagline: "Different grain orientations produce different deformation.",
    description:
      "Build plastic-flow and hardening laws on crystallographic slip systems, then account for intergranular constraints to predict the anisotropic response of a polycrystal.",
    length: "μm – mm",
    time: "μs–h, depending on loading",
    difficulty: "Intermediate",
    prerequisites: [
      "Stress and strain",
      "Crystal orientation",
      "Plastic yielding",
    ],
    intuition:
      "A piece of metal contains many grains pointing in different directions. Under the same applied load, some have favorably oriented slip systems and deform readily, while others need a larger stress. Crystal plasticity brings this microscopic directionality into macroscopic mechanics.",
    concepts: [
      {
        title: "01 · Resolve stress onto a slip system",
        body: "Each slip system has a unit slip direction $\\mathbf s$ and unit slip-plane normal $\\mathbf n$. Resolved shear stress $\\tau=\\mathbf s\\cdot\\boldsymbol\\sigma\\cdot\\mathbf n$ drives slip. Under uniaxial loading, this gives the Schmid factor $m=\\cos\\lambda\\cos\\varphi$.",
      },
      {
        title: "02 · From slip to plastic flow",
        body: "A common power law relates slip rate to $\\tau/g$, where $g$ is slip resistance. This resistance evolves with accumulated slip to describe self- and latent hardening. Finite-deformation models also need to account for lattice rotation.",
      },
      {
        title: "03 · A polycrystal is not a simple average",
        body: "Real grains must satisfy deformation compatibility and force balance. Taylor’s uniform-strain and Sachs’s uniform-stress models are different limiting approximations. Crystal-plasticity finite elements explicitly resolve spatial constraints.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}\\tau^{\\alpha} &= \\mathbf s^{\\alpha}\\cdot\\boldsymbol{\\sigma}\\cdot\\mathbf n^{\\alpha} \\\\ \\dot\\gamma^{\\alpha} &= \\dot\\gamma_0\\left|\\frac{\\tau^{\\alpha}}{g^{\\alpha}}\\right|^n\\operatorname{sign}(\\tau^{\\alpha})\\end{aligned}",
      explanation:
        "$\\alpha$ labels a slip system, $g^\\alpha$ is slip resistance and $n$ controls rate sensitivity. For a single-slip, uniaxial approximation, $\\sigma_{\\mathrm y}=\\tau_{\\mathrm c}/|m|$, with $|m|\\leq1/2$. A system with $m=0$ has no resolved shear stress under that loading direction.",
    },
    steps: [
      "Define grain orientations and permitted slip systems.",
      "Transform the applied stress into resolved shear stress in each grain.",
      "Calculate slip rates and update hardening and lattice rotation.",
      "Couple grains through compatibility and equilibrium, then obtain the macroscopic response.",
    ],
    code: '# Schmid law: planar single-slip illustration, not a complete polycrystal solver\nimport numpy as np\nangle = np.linspace(5, 85, 9)\ntheta = np.deg2rad(angle)\n# Slip direction and plane normal are orthogonal; uniaxial loading direction is fixed\nschmid = np.abs(np.cos(theta)*np.sin(theta))\ncritical_shear = 30.0  # MPa\nuniaxial_yield = critical_shear / schmid\nfor a, m, y in zip(angle, schmid, uniaxial_yield):\n    print(f"Orientation {a:4.0f}°  Schmid {m:.3f}  Yield {y:.1f} MPa")',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Why some grains yield first",
      description:
        "Load 36 independently oriented grains under a uniform axial stress. Change the target stress and critical resolved shear stress to see which grains first meet the slip-activation criterion.",
      observe: [
        "Why are orientations near 45° easy to activate in this single-slip geometry?",
        "How does the fraction of activated grains change as target stress rises?",
        "At the same load, how does raising the critical resolved shear stress change the activated fraction?",
      ],
      limitations:
        "A simplified orientation and slip-activation model. It does not solve full crystal-plasticity finite elements, complete FCC/BCC slip systems, grain compatibility or latent hardening. The schematic grain map is not measured EBSD data.",
    },
    applications: [
      "Sheet-metal anisotropy and forming",
      "Effects of texture on yielding and hardening",
      "Grain-scale strain localization and fatigue",
    ],
    limitations: [
      "Slip systems, rate sensitivity and hardening parameters require calibration.",
      "Orientation projection alone does not determine grain-boundary effects.",
      "A single-slip illustration cannot reproduce full load redistribution in a polycrystal.",
    ],
    connections: [
      {
        id: "dd",
        reason:
          "Dislocation mechanisms inform slip resistance, mobility and hardening laws.",
      },
      {
        id: "fem",
        reason:
          "Place a crystal-plasticity constitutive model at finite-element integration points to solve intergranular compatibility.",
      },
    ],
    references: [
      {
        title:
          "Overview of constitutive laws, kinematics, homogenization and multiscale methods in crystal plasticity finite-element modeling",
        author: "F. Roters et al. (2010)",
        url: "https://doi.org/10.1016/j.actamat.2009.10.058",
      },
      {
        title: "DAMASK documentation",
        author: "DAMASK developers",
        url: "https://damask-multiphysics.org/",
      },
    ],
  },
  {
    id: "constitutive",
    scale: "continuum",
    title: "Constitutive, Rate & State Equations",
    english: "Constitutive, Rate & State Equations",
    short: "STATE",
    tagline: "Turn microscopic mechanisms into useful material laws.",
    description:
      "Relate stress, strain, temperature and internal state variables to describe elastic, viscous, plastic and history-dependent material response.",
    length: "μm – m",
    time: "ms–h or longer",
    difficulty: "Foundation",
    prerequisites: [
      "Stress and strain",
      "Ordinary differential equations",
      "Springs and dashpots",
    ],
    intuition:
      "Rubber, steel and honey respond very differently to a load, even if they have the same shape. Equilibrium equations describe how forces balance; constitutive equations describe how the material responds. Internal state variables allow a material to remember earlier deformation.",
    concepts: [
      {
        title: "01 · Conservation laws are not enough",
        body: "Conservation of mass, momentum and energy applies broadly, but does not determine a specific material’s response. A constitutive relation supplies the material information connecting stress, strain, temperature and other variables to close the continuum problem.",
      },
      {
        title: "02 · Rates and history",
        body: "A spring describes instantaneous elasticity; a dashpot describes rate-dependent flow. Putting them in series gives the Maxwell model: stress decays while total strain is held fixed. More general plasticity and damage models introduce internal-state evolution equations.",
      },
      {
        title: "03 · Parameters need experimental constraints",
        body: "A general form is $\\sigma=\\sigma(\\varepsilon,q,T)$, with $\\dot q=g(\\dot\\varepsilon,q,T)$ for internal states such as plastic strain, hardening and damage. Friction also has the Dieterich–Ruina rate-and-state law $\\mu=\\mu_0+a\\ln(v/v_0)+b\\ln(\\theta v_0/D_{\\mathrm c})$, often paired with $\\dot\\theta=1-v\\theta/D_{\\mathrm c}$ for $v>0$. This chapter simulates Maxwell relaxation, not that friction law. Parameters must be calibrated over the intended loading and temperature range.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}\\dot\\varepsilon &= \\frac{\\dot\\sigma}{E}+\\frac\\sigma\\eta \\\\ \\sigma(t) &= \\sigma_0\\exp\\left(-\\frac t\\tau\\right),\\qquad \\tau=\\frac\\eta E\\end{aligned}",
      explanation:
        "For the Maxwell model, $E$ is elastic modulus and $\\eta$ is viscosity. The exponential solution applies after an instantaneous strain is imposed and held constant, with $\\sigma_0=E\\varepsilon_0$. The relaxation time is $\\tau=\\eta/E$.",
    },
    steps: [
      "Specify the material, loading protocol and relevant timescale.",
      "Choose elastic, viscous and internal-variable components.",
      "Calibrate parameters against experiments and integrate the state equations.",
      "Validate predictions using loading histories excluded from the fit.",
    ],
    code: '# Maxwell stress relaxation, SI units; fixed total strain\nimport numpy as np\nE, eta, strain = 100e6, 200e6, 0.02  # Pa, Pa*s, dimensionless\ntau = eta / E\ntime = np.linspace(0, 5*tau, 101)\nstress = E*strain*np.exp(-time/tau)\nprint("Relaxation time / s:", tau)\nprint("Initial stress / MPa:", stress[0]/1e6)\nprint("Fraction remaining after one tau:", np.exp(-1))',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Hold the stretch and watch the stress relax",
      description:
        "Apply and hold total strain $\\varepsilon_0=0.02$. Adjust elastic modulus $E$ and relaxation time $\\tau$ to observe Maxwell stress relaxation. The corresponding viscosity is $\\eta=E\\tau$.",
      observe: [
        "Why does about 36.8% of the initial stress remain after one relaxation time?",
        "At fixed $E$, does increasing $\\tau$, and therefore viscosity, make stress decay faster or slower?",
        "Holding strain and holding stress are different experiments. Do not confuse stress relaxation with creep.",
      ],
      limitations:
        "A linear, small-strain, isothermal Maxwell model with one relaxation branch. It cannot fully represent a polymer’s broad relaxation spectrum, metal yielding, damage or a frictional rate-and-state law.",
    },
    applications: [
      "Viscoelastic response of polymers and soft materials",
      "Material submodels for engineering structures",
      "An entry point to creep, plasticity and damage evolution",
    ],
    limitations: [
      "Parameters and laws have limited temperature and loading-rate ranges.",
      "One Maxwell branch cannot fit every relaxation response.",
      "Constitutive laws must be combined with boundary conditions and equilibrium equations.",
    ],
    connections: [
      {
        id: "fem",
        reason:
          "A constitutive model converts strain to stress at finite-element integration points.",
      },
      {
        id: "crystal-plasticity",
        reason:
          "Crystal plasticity is a family of constitutive models based on slip mechanisms and internal variables.",
      },
    ],
    references: [
      {
        title: "Viscoelastic Properties of Polymers",
        author: "J. D. Ferry",
        url: "https://www.wiley.com/en-us/Viscoelastic+Properties+of+Polymers%2C+3rd+Edition-p-9780471048947",
      },
      {
        title: "Introduction to the Mechanics of a Continuous Medium",
        author: "L. E. Malvern",
        url: "https://archive.org/details/introductiontome0000malv",
      },
      {
        title:
          "Modeling of rock friction: 1. Experimental results and constitutive equations",
        author: "J. H. Dieterich (1979)",
        url: "https://doi.org/10.1029/JB084iB05p02161",
      },
    ],
  },
  {
    id: "fem",
    scale: "continuum",
    title: "Finite Element Method",
    english: "Finite Element Method",
    short: "FEM",
    tagline: "Divide a structure into small elements, then connect them.",
    description:
      "Write a continuum boundary-value problem in weak form, approximate the unknown field over finite elements, and assemble a global solution subject to boundary conditions.",
    length: "μm – m",
    time: "Static, or μs–h",
    difficulty: "Foundation",
    prerequisites: ["Linear algebra", "Force balance", "Stress and strain"],
    intuition:
      "An entire complex bar may be difficult to solve at once, but each short segment behaves like a spring with a known stiffness. Finite elements assemble these local responses while enforcing common displacements at shared nodes and force balance at internal nodes. The result is the deformation of the whole structure.",
    concepts: [
      {
        title: "01 · Approximate a continuous field with shape functions",
        body: "Nodes store unknown values and shape functions interpolate within an element. In a one-dimensional linear bar element, displacement varies linearly while strain and stress are constant inside the element.",
      },
      {
        title: "02 · Assembly and boundary conditions",
        body: "Element stiffnesses add into a global matrix $\\mathbf K$, producing $\\mathbf K\\mathbf u=\\mathbf f$. A fixed end removes rigid-body motion; natural boundary conditions prescribe forces. Without sufficient constraints, the stiffness matrix can be singular.",
      },
      {
        title: "03 · Verification and convergence",
        body: "Results depend on the mesh, element order, quadrature and constitutive law. Check reaction-force balance, analytical benchmarks and mesh convergence. Rendered deformation is often magnified and must be distinguished from the physical displacement readout.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}\\mathbf K\\mathbf u &= \\mathbf f \\\\ \\mathbf k_e &= \\frac{EA}{L_e}\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}\\end{aligned}",
      explanation:
        "$E$ is Young’s modulus, $A$ the cross-sectional area and $L_e$ the element length. A uniform bar fixed at its left end and pulled by force $F$ at its right end has analytical tip displacement $u(L)=FL/(EA)$.",
    },
    steps: [
      "Mesh the geometry and define materials and degrees of freedom.",
      "Compute element stiffnesses and loads and assemble the global system.",
      "Apply displacement boundary conditions and solve for nodal displacements.",
      "Recover strain and stress; check reactions against analytical solutions or mesh-convergence studies.",
    ],
    code: '# 1D axial bar, fixed left end and tensile right-end force; SI units\nimport numpy as np\nn, L, E, A, force = 20, 1.0, 100e9, 1e-4, 50.0\nK = np.zeros((n+1,n+1)); f = np.zeros(n+1); f[-1] = force\nke = E*A/(L/n)*np.array([[1.,-1.],[-1.,1.]])\nfor e in range(n):\n    K[e:e+2,e:e+2] += ke\nu = np.zeros(n+1)\nu[1:] = np.linalg.solve(K[1:,1:], f[1:])\nreaction = K@u-f\nprint("Tip displacement / m:", u[-1], "Analytical value:", force*L/(E*A))\nprint("Fixed-end reaction / N:", reaction[0])',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Build a bar from finite elements",
      description:
        "Use 20 linear bar elements. Change the end force and Young’s modulus, observe nodal displacements and stretching, and compare with the analytical solution $u(L)=FL/(EA)$.",
      observe: [
        "Does doubling the force double the displacement in this linear model?",
        "Does increasing Young’s modulus make the structure stiffer or softer?",
        "A uniform end-loaded bar has a linear displacement field that linear elements represent exactly. This special case does not mean mesh refinement is never important.",
      ],
      limitations:
        "A one-dimensional, small-deformation, linearly elastic axial bar. The 3D view displays nodes and magnified displacements; it is not a three-dimensional solid-element solution. Bending, buckling, contact and plasticity are absent.",
    },
    applications: [
      "Stress and deformation in engineering structures",
      "Heat conduction, vibration and coupled physics",
      "Spatial mechanical response of material microstructures",
    ],
    limitations: [
      "FEM is a discretization method, not a substitute for a reliable material law.",
      "Stress singularities, distorted meshes and inappropriate constraints can mislead.",
      "Nonlinear and transient problems also require iteration and time integration.",
    ],
    connections: [
      {
        id: "constitutive",
        reason:
          "Constitutive laws determine stress and tangent stiffness within elements.",
      },
      {
        id: "fdm",
        reason:
          "Compare weak-form element discretization with grid methods that replace derivatives directly.",
      },
    ],
    references: [
      {
        title: "The Finite Element Method: Its Basis and Fundamentals",
        author: "O. C. Zienkiewicz, R. L. Taylor & J. Z. Zhu",
        url: "https://doi.org/10.1016/C2009-0-24909-9",
      },
      {
        title: "The FEniCSx tutorial",
        author: "J. S. Dokken",
        url: "https://jsdokken.com/dolfinx-tutorial/",
      },
    ],
  },
  {
    id: "fdm",
    scale: "continuum",
    title: "Finite Difference Method",
    english: "Finite Difference Method",
    short: "FDM",
    tagline: "Approximate derivatives using differences between neighbors.",
    description:
      "Replace derivatives in a differential equation by differences on a regular grid to obtain discrete equations that can be advanced in time or solved directly.",
    length: "μm – m",
    time: "μs–h, depending on the problem",
    difficulty: "Foundation",
    prerequisites: ["Derivatives", "Grids", "Heat diffusion"],
    intuition:
      "Divide a heated plate into small cells. A cell hotter than its neighbors loses heat to them; a colder cell gains heat from its surroundings. Applying this local rule across the grid produces the macroscopic picture of diffusion.",
    concepts: [
      {
        title: "01 · Derivatives from local differences",
        body: "Central differences use neighboring grid values to approximate first or second derivatives. The classic two-dimensional five-point stencil combines the center and its four neighbors to approximate the Laplacian.",
      },
      {
        title: "02 · Time stepping has a stability condition",
        body: "Explicit Euler is easy to understand, but the heat equation requires a sufficiently small timestep. For an equally spaced two-dimensional grid, $r=\\alpha\\Delta t/\\Delta x^2\\leq1/4$ is the standard stability bound. A larger step can cause unphysical oscillations or divergence.",
      },
      {
        title: "03 · Boundary conditions change the answer",
        body: "Fixed temperature, prescribed flux, insulated and periodic boundaries represent different physical situations. Here the boundary temperature is held at zero, so heat leaves and the mean temperature falls. With periodic or insulated boundaries and no source, the mean should instead remain constant.",
      },
    ],
    equation: {
      formula:
        "\\begin{aligned}\\frac{\\partial T}{\\partial t} &= \\alpha\\nabla^2 T \\\\ T_{i,j}^{n+1} &= (1-4r)T_{i,j}^{n} \\\\ &\\quad+r\\left(T_{i+1,j}^{n}+T_{i-1,j}^{n}\\right) \\\\ &\\quad+r\\left(T_{i,j+1}^{n}+T_{i,j-1}^{n}\\right),\\qquad r=\\frac{\\alpha\\Delta t}{\\Delta x^2}\\end{aligned}",
      explanation:
        "$\\alpha$ is thermal diffusivity and $r=\\alpha\\Delta t/\\Delta x^2$. This formula applies to a two-dimensional grid with $\\Delta x=\\Delta y$ and explicit time stepping. Specify units and boundary conditions before discretization.",
    },
    steps: [
      "Set the domain, grid and initial temperature.",
      "Approximate the Laplacian with a five-point stencil and impose boundary conditions.",
      "Advance the temperature field using a timestep that meets the stability bound.",
      "Check conservation where applicable, extrema and mesh/timestep convergence.",
    ],
    code: '# 2D heat diffusion, zero-temperature Dirichlet boundaries; same model class as the browser experiment\nimport numpy as np\nn, alpha = 32, 0.5\nx, y = np.meshgrid(np.linspace(0,1,n),np.linspace(0,1,n))\nT = np.exp(-((x-0.5)**2+(y-0.5)**2)/0.02)\nT[[0,-1],:] = 0; T[:,[0,-1]] = 0\ndx = 1/(n-1); dt = 0.18*dx*dx; r = alpha*dt/dx**2\ninitial_mean = T.mean()\nfor _ in range(400):\n    lap = T[2:,1:-1]+T[:-2,1:-1]+T[1:-1,2:]+T[1:-1,:-2]-4*T[1:-1,1:-1]\n    T[1:-1,1:-1] += r*lap\nprint("Stability parameter r:", r, "must be <= 0.25")\nprint("Initial/current mean temperature:", initial_mean, T.mean())\n# Mean temperature falls because heat leaves through the fixed zero-temperature boundary.',
    codeLanguage: "Python · NumPy",
    experiment: {
      title: "Watch a hot spot spread out",
      description:
        "Start with a Gaussian hot spot and advance the two-dimensional heat equation using explicit finite differences. The square boundary remains at zero temperature. Change diffusivity and initial amplitude, then compare the color map and 3D temperature surface.",
      observe: [
        "As the peak drops, heat spreads outward and eventually leaves through the zero-temperature boundary.",
        "How does a larger diffusivity change the speed at which the field approaches the boundary temperature?",
        "Raise the initial peak and compare heat content and surface height. This is an initial condition, not a continuous heat source.",
      ],
      limitations:
        "Dimensionless, constant-coefficient, two-dimensional heat diffusion with zero-temperature Dirichlet boundaries and a stable timestep. Mean temperature is not conserved because heat leaves the boundary. Surface height represents temperature, not geometric thickness. Convection, radiation and temperature-dependent properties are omitted.",
    },
    applications: [
      "Heat conduction and diffusion equations",
      "Wave and flow problems on regular domains",
      "Rapid prototypes for phase-field and other evolution PDEs",
    ],
    limitations: [
      "Complex geometries and local mesh refinement require more elaborate treatment.",
      "Explicit methods often face strict timestep limits.",
      "Stability does not imply accuracy; discretization-convergence checks remain necessary.",
    ],
    connections: [
      {
        id: "phase-field",
        reason:
          "Adding a free-energy derivative to a diffusion term produces a basic phase-field evolution equation.",
      },
      {
        id: "fem",
        reason:
          "Finite elements are often convenient for complex geometry; finite differences are usually more direct on regular domains.",
      },
    ],
    references: [
      {
        title:
          "Finite Difference Methods for Ordinary and Partial Differential Equations",
        author: "R. J. LeVeque",
        url: "https://doi.org/10.1137/1.9780898717839",
      },
      {
        title: "Finite Difference Computing with PDEs",
        author: "H. P. Langtangen & S. Linge",
        url: "https://doi.org/10.1007/978-3-319-55456-3",
      },
    ],
  },
];
