import type { Ast } from "../read.ts";
import type { Env } from "../env.ts";
import type { Atom } from "../atom.ts";

import evalLet from "./let.ts";
import handleDef from "./def.ts";
import resolveKey from "./key.ts";

import Error from "@utils/error.ts";

const evalAst = (ast: Ast, env: Env): Ast => {
  if (Array.isArray(ast)) {
    if (ast[0] === "def" || ast[0] === "defc") return handleDef(ast, env);
    if (ast[0] === "let") return evalLet(ast, env);
    return ast.map((ast) => evalAst(ast, env));
  }

  if (typeof ast === "string") {
    if (ast[0] === '"' && ast[ast.length - 1] === '"') return ast;
    return resolveKey(ast, env);
  }

  return ast;
};

const apply = (ast: Ast): Atom => {
  if (!Array.isArray(ast)) return ast;

  if (ast.length < 2) return (ast[0] ? ast[0] : null) as Atom;

  if (!(typeof ast[0] === "function")) return Error.panic("not a function");

  let [fn, ...args] = ast;
  args = args.map((exp) => apply(exp));

  return fn(...args);
};

const _eval = (ast: Ast, env: Env) => {
  if (!Array.isArray(ast)) return ast;

  const res: Atom[] = [];

  ast.forEach((exp) => {
    if (!Array.isArray(exp)) return;

    try {
      exp = evalAst(exp, env);
      exp = apply(exp);
      res.push(exp);
    } catch (error) {
      // Improve error creation on code prettyfying
      Error.panic({ message: error, code: exp?.toString() });
    }
  });

  return res;
};

const evaluator = {
  eval: _eval,
};

export default evaluator;
export { evalAst, apply };
