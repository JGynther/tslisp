import type { Ast } from "./read.ts";
import type { Env } from "./env.ts";
import type { Atom } from "./atom.ts";
import Error from "@utils/error.ts";

// TODO: add better verification for key
const handleDef = (ast: Ast[], env: Env) => {
  const key = ast[1];

  ast.splice(1, 1);
  ast = ast.map((ast) => evalAst(ast, env));
  ast.splice(1, 0, key);

  return ast;
};

const evalAst = (ast: Ast, env: Env): Ast => {
  if (Array.isArray(ast)) {
    if (ast[0] === "def") return handleDef(ast, env);
    return ast.map((ast) => evalAst(ast, env));
  }

  if (typeof ast === "string") {
    if (ast[0] === '"' && ast[ast.length - 1] === '"') return ast;

    if (ast in env) return env[ast];
    else return Error.panic({ message: `unknown variable: ${ast}`, code: ast });
  }

  return ast;
};

const apply = (ast: Ast): Atom => {
  if (!Array.isArray(ast)) return ast;

  if (ast.length < 2) return (ast[0] ? ast[0] : null) as Atom;

  if (!(typeof ast[0] === "function"))
    return Error.panic({ message: "not a function", code: ast.toString() });

  let [fn, ...args] = ast;
  args = args.map((exp) => apply(exp));

  return fn(...args);
};

const _eval = (ast: Ast, env: Env) => {
  if (!Array.isArray(ast)) return ast;

  ast = ast.filter((exp) => Array.isArray(exp));
  ast = ast.map((exp) => evalAst(exp, env));

  return ast.map((exp) => apply(exp));
};

const evaluator = {
  eval: _eval,
};

export default evaluator;
