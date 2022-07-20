import Error from "@utils/error.ts";
import type { Atom } from "./atom.ts";

type Constants = string[];
type Env = {
  outer: Env | null;
  constants: Constants;
  [key: string]: Atom | Env | Constants;
};

// prettier-ignore
const reservedKeys = [
    // Keywords
    "def", "set", "write", 
    // Basic operators
    "+", "-", "*", "/", 
    // Base values
    "true", "false", "nil"
];

const set = (env: Env, key: string, value: Atom) => {
  if (reservedKeys.includes(key))
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
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
  write: (...args: Atom[]) => args,
  def: (key: string, value: Atom) => set(env, key, value),
  defc: (key: string, value: Atom) => setConst(env, key, value), // Define immutable constants
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
