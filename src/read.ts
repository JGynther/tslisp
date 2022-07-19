import { atomize, type Atom } from "./atom.ts";

type Ast = Atom | Ast[];

const createTree = (str: string) => {
  const ast: Ast = [];
  const length = str.length;
  let token = "";

  const pushToken = () => {
    token = token.trim();

    if (!token) return;

    const atoms = atomize(token.split(" "));
    ast.push(...atoms);

    token = "";
  };

  for (let i = 0; i < length; ++i) {
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
      // TODO: improve error message construction
      if (open)
        throw (
          "Error: expected a ')' near\n" +
          "-".repeat(30) +
          "\n" +
          `1:${i} |  ` +
          str.slice(i, j + 1) +
          "\n" +
          "-".repeat(30)
        );

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
export type { Ast };
