import type { Ast } from "../read.ts";
import type { Env } from "../env.ts";

import evalLet from "./let.ts";
import handleDef from "./def.ts";
import resolveKey from "./key.ts";
import evalLambda from "./lambda.ts";

import { handleImport } from "../import.ts";

const evalAst = (ast: Ast, env: Env): Ast => {
  if (Array.isArray(ast)) {
    if (ast.length === 1) return _eval(ast[0], env);

    switch (ast[0]) {
      case "def":
        return handleDef(ast, env);

      case "defc":
        return handleDef(ast, env);

      case "let":
        return evalLet(ast, env);

      case "lambda":
        return evalLambda(ast, env);

      case "import":
        return handleImport(ast, env);

      default: {
        // FIXME: clean this up
        const tmp: Ast = [];

        ast.forEach((exp) => {
          const res = _eval(exp, env);
          (res || res === 0) && tmp.push(res);
        });

        return tmp;
      }
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

const _eval = (ast: Ast, env: Env) => apply(evalAst(ast, env));

const evaluator = {
  eval: _eval,
};

export default evaluator;
export { _eval };
