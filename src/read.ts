import { atomize, type Atom } from "./atom.ts";
import Error from "@utils/error.ts";

type KeyVal = [string, Atom];
type Ast = Atom | KeyVal | Ast[];

const createTree = (str: string) => {
  const ast: Ast = [];
  const length = str.length;
  let token = "";

  const pushToken = () => {
    token = token.trim();

    if (!token) return;

    const atoms = atomize(token);
    ast.push(...atoms);

    token = "";
  };

  for (let i = 0; i < length; ++i) {
    // Handle comments
    if (str[i] === ";") {
      for (; i < length; ++i) if (str[i] === "\n") break;
      continue;
    }

    // Handle strings
    // TODO: this is not pretty
    if (str[i] === '"') {
      pushToken();

      token += str[i];
      ++i;
      let open = true;

      for (; i < length; ++i) {
        token += str[i];
        if (str[i] !== '"') continue;

        open = false;
        ast.push(token);
        token = "";

        break;
      }

      if (open) Error.panic("unclosed string");

      continue;
    }

    if (str[i] === "(") {
      pushToken();

      let open = 1;
      let j = i + 1;
      for (; j < length; ++j) {
        if (str[j] === "(") ++open;
        if (str[j] === ")") --open;
        if (open === 0) break;
      }

      // On a missing closing parenthesis
      if (open)
        Error.panic({
          message: "missing closing parenthesis ')' near",
          line: i,
          code: str.slice(i, j + 1),
        });

      const segment = str.slice(i + 1, j);
      const _ast = createTree(segment);
      ast.push(_ast);

      i = j;
    }

    if (str[i] === ")") continue;

    token += str[i];
  }

  pushToken();

  return ast;
};

const read = (str: string) => {
  return createTree(str);
};

const reader = {
  read,
};

export default reader;
export type { Ast, KeyVal };
