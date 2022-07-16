const READ = (str: string) => str;

const EVAL = (ast: string) => ast;

const PRINT = (exp: string) => exp;

const rep = (str: string) => PRINT(EVAL(READ(str)));

const repl = {
  start: () => {
    while (true) {
      const line = prompt("user> ");
      line && console.log(rep(line));
    }
  },
};

export default repl;
