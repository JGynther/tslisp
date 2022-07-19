import reader, { type Ast } from "./read.ts";
import Error from "@utils/error.ts";

const READ = (str: string) => reader.read(str);
const EVAL = (ast: Ast) => ast;
const PRINT = (exp: any) => exp;

const rep = (str: string) => PRINT(EVAL(READ(str)));

const repl = {
  start: () => {
    while (true) {
      const line = prompt("user> ");
      try {
        if (line) {
          console.log(rep(line));
        }
      } catch (error) {
        Error.log(error);
      }
    }
  },
};

export default repl;
