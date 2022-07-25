import reader, { type Ast } from "./read.ts";
import evaluator from "./eval/index.ts";

import env, { type Env } from "./env.ts";

import Error from "@utils/error.ts";

const READ = (str: string) => reader.read(str);
const EVAL = (ast: Ast, env: Env) => evaluator.eval(ast, env);
const PRINT = (exp: Ast) => console.log(exp); // TODO: create proper printer..

const rep = (str: string, env: Env) => PRINT(EVAL(READ(str), env));

const repl = {
  start: () => {
    const _env = env;
    while (true) {
      const line = prompt("user> ");
      try {
        if (line) {
          rep(line, _env);
        }
      } catch (error) {
        Error.log(error);
      }
    }
  },
};

export default repl;
export { READ, EVAL, rep };
