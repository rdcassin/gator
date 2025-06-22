import { CommandHandler } from "src/commands/commands";
import { User } from "../schema";
import { readConfig } from "src/config";
import { getUser } from "../queries/users";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type middlewareLoggedIn = (
  handler: UserCommandHandler
) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler) {
  return async (cmdName: string, ...args: string[]) => {
    const userName = readConfig().currentUserName;
    const user = await getUser(userName);
    if (!user) {
      throw new Error("please login/register before proceeding");
    }

    await handler(cmdName, user, ...args);
  };
}
