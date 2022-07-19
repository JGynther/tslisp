// deno-lint-ignore ban-types
type Atom = Function | string | number | boolean | null;

const atom = (token: string) => {
  // If given atom is a number
  if (Number(token)) return Number(token);

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

const atomize = (tokens: string[]) => {
  const l = tokens.length;
  const atoms: Atom[] = [];
  for (let i = 0; i < l; ++i) atoms[i] = atom(tokens[i]);
  return atoms;
};

export { atom, atomize };
export type { Atom };
