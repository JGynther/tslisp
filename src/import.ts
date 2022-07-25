import { type Ast } from "./read.ts";

import { READ, EVAL } from "./repl.ts";
import { Env } from "./env.ts";

import Error from "@utils/error.ts";

const _import = (name: string, env: Env) => {
  try {
    name = `std/${name}.lisp`;
    const file = Deno.readTextFileSync(name);
    EVAL(READ(file), env);
  } catch (error) {
    Error.log(error);
  }
};

const handleImport = (ast: Ast[], env: Env) => {
  const name = ast[1];

  if (!(typeof env.import === "function"))
    return Error.panic("fatal: import failed");

  env.import(name);

  return null;
};

export default _import;
export { handleImport };
