import type { Ast, KeyVal } from "../read.ts";
import { type Env, newEnv } from "../env.ts";
import { evalAst, apply } from "./index.ts";
import Error from "@utils/error.ts";

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

export default evalLet;
