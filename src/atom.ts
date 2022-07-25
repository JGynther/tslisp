// deno-lint-ignore ban-types
type Atom = Function | string | number | boolean | null;

const atom = (token: string) => {
  // If given atom is a number
  const testNumber = Number(token);
  if (testNumber || testNumber === 0) return Number(token);

  // True, false, null
  switch (token) {
    case "true":
      return true;
    case "false":
      return false;
    case "nil":
      return null;
  }

  return token;
};

const atomize = (_tokens: string) => {
  const tokens = _tokens.split(/\s+/);

  const length = tokens.length;
  const atoms: Atom[] = [];

  for (let i = 0; i < length; ++i) atoms[i] = atom(tokens[i]);

  return atoms;
};

export { atom, atomize };
export type { Atom };
