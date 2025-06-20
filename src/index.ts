import { readConfig } from "./config";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";
import { handlerAggregate } from "./commands/aggregate";
import { handlerReset } from "./commands/reset";

async function main() {
  const cfg = readConfig();
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, "login", handlerLogin);
  registerCommand(commandRegistry, "register", handlerRegister);
  registerCommand(commandRegistry, "users", handlerListUsers);
  registerCommand(commandRegistry, "agg", handlerAggregate);

  registerCommand(commandRegistry, "reset", handlerReset);

  if (process.argv.length <= 2) {
    console.log("no command received");
    process.exit(1);
  }
  const userInput = process.argv.slice(2);
  const cmdName = userInput[0];
  const args = userInput.slice(1);
  try {
    await runCommand(commandRegistry, cmdName, ...args);
  } catch (err) {
    console.log((err as Error).message);
    process.exit(1);
  }
  process.exit(0);
}

main();
