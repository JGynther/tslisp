import type { Ast, KeyVal } from "./read.ts";
import { type Env, newEnv } from "./env.ts";
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

// Evaluate let expressions "out of" normal loop,
// ie. implement a loop similar to normal eval loop
const evalLet = (ast: Ast[], _env: Env) => {
  const [, bindings, ...rest] = ast as [string, KeyVal[], Ast];
  const env = newEnv(_env);

  if (!Array.isArray(bindings))
    return Error.panic("let bindings must be a list");

  // Bind using default env.def for safety
  bindings.forEach(([key, value]) => env.def(key, value));

  // Mimic normal eval loop
  let tmp = rest.map((exp) => evalAst(exp, env));
  tmp = tmp.map((exp) => apply(exp));

  return tmp[tmp.length - 1];
};

// TODO: check for unallowed keys
const resolveKey = (key: string, env: Env): Atom => {
  if (key in env) return env[key] as Atom;
  if (env.outer) return resolveKey(key, env.outer);
  return Error.panic(`unknown variable: ${key}`);
};

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
