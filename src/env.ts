import Error from "@utils/error.ts";
import type { Atom } from "./atom.ts";

type Env = { [key: string]: Atom };

// prettier-ignore
const reservedKeys = [
    // Keywords
    "def", "set", "write", 
    // Basic operators
    "+", "-", "*", "/", 
    // Base values
    "true", "false", "nil"
];

const constantKeys: string[] = [];

const set = (env: Env, key: string, value: Atom, constant = false) => {
  if (reservedKeys.includes(key))
    Error.panic({
      message: `cannot (re)define reserved variable: ${key}`,
    });

  if (constantKeys.includes(key))
    Error.panic({ message: `cannot redefine constant: ${key}` });

  env[key] = value;
  if (constant) constantKeys.push(key);

  return `${constant ? "(const) " : ""}${key}: ${value}`;
};

const env: Env = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
  write: (...args: Atom[]) => args,
  def: (key: string, value: Atom) => set(env, key, value),
  defc: (key: string, value: Atom) => set(env, key, value, true), // Define immutable constants
};

export default env;
export type { Env };
