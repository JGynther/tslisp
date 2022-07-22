import type { Ast } from "../read.ts";
import { type Env, newEnv } from "../env.ts";

import { evalApply } from "./index.ts";

import Error from "@utils/error.ts";

const bind = (params: string[], exps: IArguments, env: Env) => {
  for (let i = 0; i < params.length; ++i) {
    let tmp = Object.values(exps)[i];

    tmp = evalApply(tmp, env);

    env.def(params[i], tmp);
  }
};

const evalLambda = (ast: Ast, _env: Env) => {
  const [, params, fn] = ast as [string, string[], Ast];

  if (!Array.isArray(params))
    return Error.panic("lambda: params must be a list");

  return function () {
    const env = newEnv(_env);
    bind(params, arguments, env);
    return evalApply(fn, env);
  };
};

export default evalLambda;
