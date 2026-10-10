import type { ModelingModule } from "@/core/types";
import { forEachChunked } from "@/core/compute/runSafely";
import { OrbitalView } from "./OrbitalView";

/** Density Functional Theory — electronic-structure intro + demos. */
export const dftModule: ModelingModule = {
  id: "dft",
  title: "DFT",
  summary:
    "Density functional theory: many-body electronic structure through the electron density.",
  scale: "electronic",
  accent: "#0f766e",
  tags: ["first-principles", "electronic structure", "orbitals"],
  intro: {
    lead: "DFT replaces the many-electron wavefunction with the electron density, making electronic-structure calculations practical for materials. The visualization below shows the hydrogenic orbitals that form the conceptual backbone of atomic basis sets—not a self-consistent DFT density.",
    sections: [
      {
        heading: "Core idea",
        body: "The Hohenberg–Kohn theorems show that ground-state properties are uniquely determined by the electron density. Kohn–Sham DFT maps the interacting problem onto effective single-particle orbitals; most of the remaining difficulty sits in the exchange–correlation functional.",
      },
      {
        heading: "Orbitals vs density",
        body: "Kohn–Sham orbitals are auxiliary single-particle states. The physical density is ρ(r) = Σ |φᵢ(r)|². Textbook orbital plots (1s, 2p, 3d) illustrate angular shape from spherical harmonics; production DFT codes solve self-consistent equations on grids or with basis sets.",
      },
      {
        heading: "Common approximations",
        body: "LDA, GGA, meta-GGA, and hybrid functionals form a ladder of XC approximations. Plane-wave pseudopotential and localized-basis codes dominate practice. Browser demos here are pedagogical—not substitutes for VASP, Quantum ESPRESSO, and similar codes.",
      },
    ],
    references: [
      { label: "Kohn & Sham, Phys. Rev. 140, A1133 (1965)" },
      { label: "Martin, Electronic Structure (Cambridge)" },
    ],
  },
  render: {
    label: "Orbitals",
    mount: () => () => {},
  },
  RenderPanel: OrbitalView,
  compute: {
    label: "1D well levels",
    description:
      "Analytic levels of an infinite square well, Eₙ ∝ n² / L² — a pre-DFT quantum toy for level spacing.",
    params: [
      { id: "L", label: "Well width L (Å)", type: "number", default: 5, min: 1, max: 20, step: 0.5 },
      { id: "nMax", label: "Max quantum number n", type: "number", default: 6, min: 1, max: 12, step: 1 },
      {
        id: "mass",
        label: "Effective mass m*/mₑ",
        type: "number",
        default: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
    ],
    run: async (values, ctx) => {
      const L = Number(values.L);
      const nMax = Math.floor(Number(values.nMax));
      const mass = Number(values.mass);
      const prefactor = 37.603 / (mass * L * L);
      const rows: (string | number)[][] = [];
      const series: { x: number; y: number }[] = [];

      await forEachChunked(nMax, 2, (i) => {
        const n = i + 1;
        const E = prefactor * n * n;
        rows.push([n, E.toFixed(4)]);
        series.push({ x: n, y: E });
      }, ctx);

      return {
        summary: `First ${nMax} levels of an infinite well (toy model, eV).`,
        table: { headers: ["n", "E (eV)"], rows },
        series,
      };
    },
  },
};
