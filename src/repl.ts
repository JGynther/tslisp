import reader, { type Ast } from "./read.ts";
import printer from "./print.ts";
import Error from "@utils/error.ts";

const READ = (str: string) => reader.read(str);
const EVAL = (ast: Ast) => ast;
const PRINT = (exp: any) =>
  (console.log(exp) as undefined) || printer.print(exp);

const rep = (str: string) => PRINT(EVAL(READ(str)));

const repl = {
  start: () => {
    while (true) {
      const line = prompt("user> ");
      try {
        if (line) {
          rep(line);
        }
      } catch (error) {
        Error.log(error);
      }
    }
  },
};

export default repl;
