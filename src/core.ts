import type { Atom } from "./atom.ts";

// prettier-ignore
const core = {
  // Basic arithmetic
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,

  // Boolean logic
  "<": (a: number, b: number) => a < b,
  "<=": (a: number, b: number) => a <= b,
  ">": (a: number, b: number) => a > b,
  ">=": (a: number, b: number) => a >= b,

  // Equality
  "=": <T>(a: T, b: T) => {
    // Array equality
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
      return true;
    }

    return a === b;
  },

  // If's and such
  if: (cond: Atom, then: Atom, else_: Atom) => (cond ? then : else_),
  
  // Lists
  "list?": (a: Atom[]) => Array.isArray(a),
  "empty?": (a: Atom[]) => a.length === 0,
  count: (a: Atom[]) => a.length,

  // Basic functions
  write: (...args: Atom[]) => args,
};

export default core;
