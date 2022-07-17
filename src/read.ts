type Ast = string | Ast[];

const createTree = (str: string) => {
  const ast: Ast = [];
  const length = str.length;
  let token = "";

  const pushToken = () => {
    if (!token) return;
    token = token.trim();
    token && ast.push(token);
    token = "";
  };

  for (let i = 0; i < length; ++i) {
    if (str[i] === "(") {
      pushToken();

      let open = 1;
      let j = i + 1;
      while (open) {
        if (str[j] === "(") ++open;
        if (str[j] === ")") --open;
        ++j;
      }

      const segment = str.slice(i + 1, j + 1);
      const _ast = createTree(segment);
      ast.push(_ast);

      i = j;
    }

    if (str[i] === ")") {
      pushToken();
      continue;
    }

    token += str[i];
  }

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
