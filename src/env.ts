import type { Atom } from "./atom.ts";

type Env = { [key: string]: Atom };

const env: Env = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
  write: (...args: Atom[]) => args,
  def: (key: string, value: Atom) => (env[key] = value),
};

export default env;
export type { Env };
