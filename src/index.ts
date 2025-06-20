import { readConfig } from "./config";
import {
    type CommandsRegistry,
    registerCommand,
    runCommand,
} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
    const cfg = readConfig();
    const commandRegistry: CommandsRegistry = {};
    registerCommand(commandRegistry, "login", handlerLogin);

    if (process.argv.length <= 2) {
        console.log("No command received");
        process.exit(1);
    }
    const userInput = process.argv.slice(2);
    const cmdName = userInput[0];
    const args = userInput.slice(1);
    try {
        runCommand(commandRegistry, cmdName, ...args);
    } catch (err) {
        console.log((err as Error).message);
        process.exit(1);
    }
}

main();