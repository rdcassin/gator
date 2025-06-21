import { setUser, readConfig } from "src/config";
import { createUser, getUser, getUsers } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <Username>`);
  }

  const name = args[0];
  const existingUser = await getUser(name);
  if (!existingUser) {
    throw new Error(`user ${name} does not exist... please register user`);
  }
  setUser(existingUser.name);
  console.log(`Username set to ${existingUser.name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <Username>`);
  }

  const name = args[0];
  const existingUser = await getUser(name);
  if (existingUser) {
    throw new Error(`user ${existingUser.name} already exists`);
  }
  const newUser = await createUser(name);
  setUser(newUser.name);
  console.log("created new user", newUser);
}

export async function handlerListUsers() {
  const allUsers = await getUsers();

  const currentUser = readConfig().currentUserName;
  for (const user of allUsers) {
    console.log(
      `* ${user.name}${user.name === currentUser ? " (current)" : ""}`
    );
  }
}