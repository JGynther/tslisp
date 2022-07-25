import type { Atom } from "./atom.ts";

import core from "./core.ts";
import _import from "./import.ts";

import Error from "@utils/error.ts";

type Constants = string[];
type Env = {
  outer: Env | null;
  constants: Constants;
  def: (key: string, value: Atom) => void;
  defc: (key: string, value: Atom) => void;
  [key: string]: Atom | Env | Constants;
};

const set = (env: Env, key: string, value: Atom) => {
  // some typescript black magic
  if (core[key as keyof typeof core])
    Error.panic(`cannot (re)define reserved variable: ${key}`);

  if (env.constants.includes(key))
    Error.panic(`cannot redefine constant: ${key}`);

  env[key] = value;
};

const setConst = (env: Env, key: string, value: Atom) => {
  set(env, key, value);
  env.constants.push(key);
};

const env: Env = {
  outer: null,
  constants: [],
  def: (key: string, value: Atom) => set(env, key, value),
  defc: (key: string, value: Atom) => setConst(env, key, value), // Define immutable constants
  import: (name: string) => _import(name, env),
  ...core,
};

const newEnv = (outer: Env): Env => {
  const _env: Env = {
    outer,
    constants: [],
    def: (key: string, value: Atom) => set(_env, key, value),
    defc: (key: string, value: Atom) => setConst(_env, key, value),
  };

  return _env;
};

export default env;
export { newEnv };
export type { Env };
