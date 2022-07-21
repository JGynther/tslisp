import type { Env } from "../env.ts";
import type { Atom } from "../atom.ts";

import Error from "@utils/error.ts";

// TODO: check for unallowed keys
const resolveKey = (key: string, env: Env): Atom => {
  if (key in env) return env[key] as Atom;
  if (env.outer) return resolveKey(key, env.outer);
  return Error.panic(`unknown variable: ${key}`);
};

export default resolveKey;
