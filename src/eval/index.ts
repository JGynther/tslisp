import type { Ast } from "../read.ts";
import type { Env } from "../env.ts";

import evalLet from "./let.ts";
import handleDef from "./def.ts";
import resolveKey from "./key.ts";
import evalLambda from "./lambda.ts";

import Error from "@utils/error.ts";

const evalAst = (ast: Ast, env: Env): Ast => {
  if (Array.isArray(ast)) {
    switch (ast[0]) {
      case "def":
        return handleDef(ast, env);

      case "defc":
        return handleDef(ast, env);

      case "let":
        return evalLet(ast, env);

      case "lambda":
        return evalLambda(ast, env);

      default:
        return ast.map((exp) => evalAst(exp, env));
    }
  }

  if (typeof ast === "string") {
    if (ast[0] === '"' && ast[ast.length - 1] === '"') return ast;
    return resolveKey(ast, env);
  }

  return ast;
};

const apply = (ast: Ast): Ast => {
  if (!Array.isArray(ast)) return ast;

  if (!(typeof ast[0] === "function")) return ast;

  let [fn, ...args] = ast;
  args = args.map((exp) => apply(exp));

  return fn(...args);
};

const evalApply = (ast: Ast, env: Env) => apply(evalAst(ast, env));

const _eval = (ast: Ast, env: Env) => {
  if (!Array.isArray(ast)) return ast;

  const res: Ast = [];

  for (let i = 0; i < ast.length; ++i) {
    let exp = ast[i];

    if (!Array.isArray(exp)) return ast;

    try {
      exp = evalAst(exp, env);
      exp = apply(exp);
      res.push(exp);
    } catch (error) {
      // Improve error creation on code prettyfying
      Error.panic({ message: error, code: exp?.toString() });
    }
  }

  return res;
};

const evaluator = {
  eval: _eval,
};

export default evaluator;
export { evalAst, apply, evalApply, _eval };
