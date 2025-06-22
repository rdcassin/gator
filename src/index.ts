import { readConfig } from "./config";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { middlewareLoggedIn } from "./lib/db/middleware/loggedIn";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";
import { handlerAggregate } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerFollow, handlerListFollows } from "./commands/feed_follows";

import { handlerReset } from "./commands/reset";

async function main() {
  const cfg = readConfig();
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, "login", handlerLogin);
  registerCommand(commandRegistry, "register", handlerRegister);
  registerCommand(commandRegistry, "users", handlerListUsers);
  registerCommand(commandRegistry, "agg", handlerAggregate);
  registerCommand(commandRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandRegistry, "feeds", handlerListFeeds);
  registerCommand(commandRegistry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(commandRegistry, "following", middlewareLoggedIn(handlerListFollows));

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
