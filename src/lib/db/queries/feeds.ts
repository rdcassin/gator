import { resourceLimits } from "worker_threads";
import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, userID: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userID: userID })
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}
