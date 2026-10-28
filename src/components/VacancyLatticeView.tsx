import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { VacancyFrame, LatticeSite } from "../simulations/vacancy-demo";
import { useLanguage } from "../i18n";

interface Props {
  frame: VacancyFrame;
  progress: number;
  mode: "3d" | "2d";
  active: boolean;
  resetToken: number;
}
const xyz = (p: LatticeSite) => new THREE.Vector3(p[0] - 2, p[1] - 2, p[2] - 2);
interface SceneState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  atoms: Map<number, THREE.Mesh>;
  vacancy: THREE.Group;
  trail: THREE.Line;
  taggedTrail: THREE.Line;
  hop: THREE.Line;
  plane: THREE.Mesh;
  trap: THREE.Mesh;
  grid: THREE.LineSegments;
  box: THREE.LineSegments;
  hostMaterial: THREE.MeshStandardMaterial;
  fadedMaterial: THREE.MeshStandardMaterial;
  render: () => void;
}

export default function VacancyLatticeView({
  frame,
  progress,
  mode,
  active,
  resetToken,
}: Props) {
  const { t } = useLanguage();
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [fallback, setFallback] = useState(false);
  const live = useRef({ frame, progress, mode });
  live.current = { frame, progress, mode };
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      setFallback(true);
      return;
    }
    const css = getComputedStyle(element);
    const color = (name: string, backup: string) =>
      css.getPropertyValue(name).trim() || backup;
    const palette = {
      host: color("--vacancy-atom", "#4b9995"),
      tagged: color("--vacancy-tagged", "#8663bd"),
      vacancy: color("--vacancy-hole", "#d9962d"),
      line: color("--vacancy-line", "#b5cecc"),
      background: color("--vacancy-background", "#f3f8f7"),
      trail: color("--vacancy-trail", "#c29443"),
    };
    renderer.setClearColor(palette.background);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.up.set(0, 0, 1);
    camera.position.set(7, -9, 7);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.minDistance = 7;
    controls.maxDistance = 20;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9cbc8, 2.6));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(0, -4, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.5);
    fill.position.set(-6, 4, 0);
    scene.add(fill);
    const sphere = new THREE.SphereGeometry(0.155, 24, 16);
    const hostMaterial = new THREE.MeshStandardMaterial({
      color: palette.host,
      roughness: 0.24,
      metalness: 0.25,
    });
    const fadedMaterial = hostMaterial.clone();
    fadedMaterial.transparent = true;
    fadedMaterial.opacity = 0.37;
    fadedMaterial.depthWrite = false;
    const taggedMaterial = new THREE.MeshStandardMaterial({
      color: palette.tagged,
      roughness: 0.22,
      metalness: 0.3,
      depthTest: false,
    });
    const atoms = new Map<number, THREE.Mesh>();
    for (const atom of live.current.frame.atoms) {
      const mesh = new THREE.Mesh(
        sphere,
        atom.id === frame.taggedId
          ? taggedMaterial
          : atom.site[2] === 2
            ? hostMaterial
            : fadedMaterial,
      );
      mesh.position.copy(xyz(atom.site));
      mesh.userData.site = atom.site;
      if (atom.id === frame.taggedId) {
        mesh.scale.setScalar(1.35);
        mesh.renderOrder = 4;
      }
      atoms.set(atom.id, mesh);
      scene.add(mesh);
    }
    const bonds: THREE.Vector3[] = [];
    for (let z = 0; z < 5; z++)
      for (let y = 0; y < 5; y++)
        for (let x = 0; x < 5; x++) {
          for (const d of [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ]) {
            if ([x + d[0], y + d[1], z + d[2]].some((n) => n >= 5)) continue;
            bonds.push(xyz([x, y, z]), xyz([x + d[0], y + d[1], z + d[2]]));
          }
        }
    const grid = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(bonds),
      new THREE.LineBasicMaterial({
        color: palette.line,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      }),
    );
    scene.add(grid);
    const cubeGeometry = new THREE.BoxGeometry(4.6, 4.6, 4.6);
    const box = new THREE.LineSegments(
      new THREE.EdgesGeometry(cubeGeometry),
      new THREE.LineBasicMaterial({
        color: palette.line,
        transparent: true,
        opacity: 0.6,
      }),
    );
    cubeGeometry.dispose();
    scene.add(box);
    const vacancy = new THREE.Group();
    for (let axis = 0; axis < 3; axis++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.235, 0.015, 8, 48),
        new THREE.MeshBasicMaterial({
          color: palette.vacancy,
          depthTest: false,
        }),
      );
      if (axis === 1) ring.rotation.x = Math.PI / 2;
      if (axis === 2) ring.rotation.y = Math.PI / 2;
      ring.renderOrder = 5;
      vacancy.add(ring);
    }
    scene.add(vacancy);
    const line = (value: string) =>
      new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color: value,
          transparent: true,
          opacity: 0.9,
          depthTest: false,
        }),
      );
    const trail = line(palette.trail),
      taggedTrail = line(palette.tagged),
      hop = line(palette.vacancy);
    for (const object of [trail, taggedTrail, hop]) {
      object.renderOrder = 3;
      scene.add(object);
    }
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.55, 4.55),
      new THREE.MeshBasicMaterial({
        color: palette.host,
        transparent: true,
        opacity: 0.035,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    plane.position.z = -0.2;
    scene.add(plane);
    const trap = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 32, 24),
      new THREE.MeshBasicMaterial({
        color: palette.vacancy,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    scene.add(trap);
    let pending = 0,
      disposed = false,
      renders = 0;
    const render = () => {
      if (pending || disposed || !activeRef.current || document.hidden) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        if (disposed || !activeRef.current || document.hidden) return;
        renderer.render(scene, camera);
        element.dataset.camera = JSON.stringify(camera.position.toArray());
        element.dataset.renderCount = String(++renders);
        element.dataset.ready = "true";
      });
    };
    state.current = {
      renderer,
      scene,
      camera,
      controls,
      atoms,
      vacancy,
      trail,
      taggedTrail,
      hop,
      plane,
      trap,
      grid,
      box,
      hostMaterial,
      fadedMaterial,
      render,
    };
    controls.addEventListener("change", render);
    const resize = () => {
      const width = Math.max(200, element.clientWidth),
        height = Math.max(300, element.clientHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const lost = (event: Event) => {
      event.preventDefault();
      setFallback(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const keys = (event: KeyboardEvent) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "=",
          "-",
          "r",
          "R",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key.toLowerCase() === "r")
        camera.position.set(
          ...((live.current.mode === "3d" ? [7, -9, 7] : [0, 0, 13]) as [
            number,
            number,
            number,
          ]),
        );
      else if (["+", "=", "-"].includes(event.key))
        camera.position.setLength(
          Math.min(
            20,
            Math.max(
              7,
              camera.position.length() * (event.key === "-" ? 1.12 : 1 / 1.12),
            ),
          ),
        );
      else if (live.current.mode === "3d") {
        const axis = ["ArrowLeft", "ArrowRight"].includes(event.key)
          ? camera.up
          : camera.position.clone().cross(camera.up).normalize();
        camera.position.applyAxisAngle(
          axis,
          ["ArrowLeft", "ArrowUp"].includes(event.key) ? 0.15 : -0.15,
        );
      }
      controls.update();
      render();
    };
    element.addEventListener("keydown", keys);
    resize();
    controls.update();
    return () => {
      disposed = true;
      cancelAnimationFrame(pending);
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      element.removeEventListener("keydown", keys);
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((m) => materials.add(m));
        }
      });
      materials.add(hostMaterial);
      materials.add(fadedMaterial);
      materials.add(taggedMaterial);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      state.current = null;
    };
  }, []);
  useEffect(() => {
    const s = state.current;
    if (!s) return;
    const slice = frame.vacancy[2];
    const updateLine = (line: THREE.Line, sites: LatticeSite[]) => {
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(sites.map(xyz));
      line.visible = sites.length >= 2;
    };
    for (const atom of frame.atoms) {
      const mesh = s.atoms.get(atom.id)!;
      mesh.position.copy(xyz(atom.site));
      if (atom.id !== frame.taggedId)
        mesh.material =
          mode === "2d" || atom.site[2] === 2
            ? s.hostMaterial
            : s.fadedMaterial;
      if (
        frame.move?.accepted &&
        frame.move.atomId === atom.id &&
        progress < 1
      ) {
        mesh.position.lerpVectors(
          xyz(frame.move.to),
          xyz(frame.move.from),
          progress,
        );
      }
      mesh.visible =
        mode === "3d" ||
        atom.site[2] === slice ||
        (frame.move?.atomId === atom.id &&
          frame.move?.accepted &&
          progress < 1);
    }
    s.vacancy.position.copy(xyz(frame.vacancy));
    if (frame.move?.accepted && progress < 1)
      s.vacancy.position.lerpVectors(
        xyz(frame.move.from),
        xyz(frame.move.to),
        progress,
      );
    updateLine(
      s.trail,
      mode === "3d"
        ? frame.vacancyTrail
        : frame.vacancyTrail.filter((p) => p[2] === slice),
    );
    updateLine(
      s.taggedTrail,
      mode === "3d"
        ? frame.taggedTrail
        : frame.taggedTrail.filter((p) => p[2] === slice),
    );
    s.trail.visible = s.trail.visible && mode === "3d"; // Filtering disjoint slice visits must not imply a connecting in-plane hop.
    s.taggedTrail.visible = s.taggedTrail.visible && mode === "3d";
    updateLine(
      s.hop,
      frame.move && !frame.move.boundary
        ? [frame.move.from, frame.move.to]
        : [],
    );
    s.plane.visible = mode === "3d";
    s.trap.visible =
      frame.parameters.trap > 0 && (mode === "3d" || slice === 2);
    s.grid.visible = mode === "3d";
    s.box.visible = mode === "3d";
    s.render();
  }, [frame, progress, mode, active]);
  useEffect(() => {
    const s = state.current;
    if (!s) return;
    s.controls.enableRotate = mode === "3d";
    s.camera.up.set(0, mode === "2d" ? 1 : 0, mode === "2d" ? 0 : 1);
    s.camera.position.set(
      ...((mode === "3d" ? [7, -9, 7] : [0, 0, 13]) as [
        number,
        number,
        number,
      ]),
    );
    s.controls.target.set(0, 0, 0);
    s.controls.update();
    s.render();
  }, [mode, resetToken]);
  useEffect(() => {
    if (fallback && host.current) {
      host.current.dataset.ready = "true";
      host.current.dataset.renderer = "svg";
    }
  }, [fallback]);
  const radius = 18,
    left = 76,
    step = 72;
  return (
    <div
      className="vacancy-scene"
      ref={host}
      tabIndex={0}
      role="img"
      aria-label={t(
        "三维原子晶格：拖动旋转，方向键转动，加减键缩放。金色圆环是空位，紫色球是被追踪原子。",
        "Atomic lattice: drag or use arrow keys to rotate, plus/minus to zoom. Gold rings mark the vacancy; the purple sphere is the tracked atom.",
      )}
      data-z-spread="4"
      data-mode={mode}
    >
      {fallback && (
        <svg
          className="vacancy-fallback"
          viewBox="0 0 440 380"
          aria-label={t(
            "空位所在晶格层的截面",
            "Lattice slice at the vacancy layer",
          )}
        >
          {frame.atoms
            .filter((a) => a.site[2] === frame.vacancy[2])
            .map((a) => (
              <circle
                key={a.id}
                cx={left + a.site[0] * step}
                cy={45 + a.site[1] * step}
                r={radius}
                className={
                  a.id === frame.taggedId
                    ? "vacancy-svg-tagged"
                    : "vacancy-svg-atom"
                }
              />
            ))}
          <circle
            cx={left + frame.vacancy[0] * step}
            cy={45 + frame.vacancy[1] * step}
            r={radius + 3}
            className="vacancy-svg-hole"
          />
          <text x="220" y="365" textAnchor="middle">
            {t(
              "晶格截面 · 当前空位层",
              "Lattice slice · current vacancy layer",
            )}
          </text>
        </svg>
      )}
    </div>
  );
}
