/**
 * Module registry entrypoint.
 *
 * To add a new topic:
 * 1. Create `src/modules/<id>/index.ts` exporting a `ModelingModule`
 * 2. Import and `registerModule(...)` here
 * 3. No changes needed in router / layout / deploy
 */
import { registerModule } from "@/core/registry";
import { dftModule } from "./dft";
import { msModule } from "./ms";
import { nebModule } from "./neb";
import { mdModule } from "./md";
import { thermoModule } from "./thermo";
import { femModule } from "./fem";

const all = [dftModule, msModule, nebModule, mdModule, thermoModule, femModule];

for (const mod of all) {
  registerModule(mod);
}

export { all as modules };
