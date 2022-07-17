type Ast = string | Ast[];

const createTree = (str: string) => {
  const ast: Ast = [];
  const length = str.length;
  let token = "";

  const pushToken = () => {
    token = token.trim();
    if (!token) return;
    ast.push(...token.split(" "));
    token = "";
  };

  for (let i = 0; i < length; ++i) {
    if (str[i] === "(") {
      pushToken();

      let open = 1;
      let j = i + 1;
      // For-loop fixes freezing on missing closing parens
      // TODO: Gracefully crash on missing closing parens
      for (; j < length; ++j) {
        if (str[j] === "(") ++open;
        if (str[j] === ")") --open;
        if (open === 0) break;
      }

      const segment = str.slice(i + 1, j - 1);
      const _ast = createTree(segment);
      ast.push(_ast);

      i = j - 1;
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
