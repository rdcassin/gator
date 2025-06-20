import { setUser } from "src/config";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <Username>`);
    }
    setUser(args[0]);
    console.log(`Username set to ${args[0]}`);
}