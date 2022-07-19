import { type Ast } from "./read.ts";

const print = (ast: Ast, iter = -2) => {
  if (!Array.isArray(ast)) return;

  const length = ast.length;

  for (let i = 0; i < length; ++i) {
    const item = ast[i];

    if (Array.isArray(item)) {
      print(item, iter + 1);
      continue;
    }

    console.log(`${getTreeStr(iter)}${item}`);
  }
};

// ├─ a
// │  ├─ b
// │  │  ├─ c
const getTreeStr = (iter: number) => {
  if (iter < 0) return "";

  const trunk = "│  ";
  const branch = "├─ ";

  if (iter === 0) return branch;

  return `${trunk.repeat(iter)}${branch}`;
};

const printer = {
  print,
};

export default printer;
