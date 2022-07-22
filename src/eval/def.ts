import type { Ast } from "../read.ts";
import { type Env } from "../env.ts";
import { _eval } from "./index.ts";

// TODO: add better verification for key
const handleDef = (ast: Ast[], env: Env) => {
  const key = ast[1];

  ast.splice(1, 1);
  ast = ast.map((ast) => _eval(ast, env));
  ast.splice(1, 0, key);

  return ast;
};

export default handleDef;
