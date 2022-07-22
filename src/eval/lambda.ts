import type { Ast } from "../read.ts";
import { type Env, newEnv } from "../env.ts";

import { _eval } from "./index.ts";

import Error from "@utils/error.ts";

const bind = (params: string[], exps: IArguments, env: Env) => {
  for (let i = 0; i < params.length; ++i) {
    let tmp = Object.values(exps)[i];

    tmp = _eval(tmp, env);

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
    return _eval(fn, env);
  };
};

export default evalLambda;
