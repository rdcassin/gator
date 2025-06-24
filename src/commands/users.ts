import { setUser, readConfig } from "src/config";
import { createUser, getUser, getUsers } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <Username>`);
  }

  const userName = args[0];
  const existingUser = await getUser(userName);
  if (!existingUser) {
    throw new Error(`user ${userName} does not exist... please register user`);
  }
  setUser(existingUser.name);
  console.log(`Username set to ${existingUser.name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <Username>`);
  }

  const userName = args[0];
  const newUser = await createUser(userName);
  if (!newUser) {
    throw new Error(`user ${userName} already exists`);
  }
  setUser(newUser.name);
  console.log("created new user", newUser.name);
}

export async function handlerListUsers(_cmdName: string, _user: User, ..._args: string[]) {
  const allUsers = await getUsers();

  const currentUser = readConfig().currentUserName;
  for (const user of allUsers) {
    console.log(
      `* ${user.name}${user.name === currentUser ? " (current)" : ""}`
    );
  }
}