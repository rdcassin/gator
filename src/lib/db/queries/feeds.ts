import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";
import { singleItemOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, user_id: string) {
  const result = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: user_id })
    .returning();
  return singleItemOrUndefined(result);
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return singleItemOrUndefined(result);
}

export async function markFeedFetched(feed_id: string) {
  const result = await db
    .update(feeds)
    .set({ updatedAt: new Date(), last_fetched_at: new Date() })
    .where(eq(feeds.id, feed_id));
  return singleItemOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`)
    .limit(1);
  return singleItemOrUndefined(result);
}
