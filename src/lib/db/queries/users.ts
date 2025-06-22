import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { singleItemOrUndefined } from "./utils";

export async function createUser(name: string) {
  const result = await db.insert(users).values({ name: name }).returning();
  return singleItemOrUndefined(result);
}

export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return singleItemOrUndefined(result);
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return singleItemOrUndefined(result);
}

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function resetUsers() {
  await db.delete(users);
}
