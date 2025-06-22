import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(user_id: string, feed_id: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ user_id: user_id, feed_id: feed_id })
    .returning();
  const [newFeedInfo] = await db
    .select({ feedName: feeds.name, username: users.name })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
  return { ...newFeedFollow, ...newFeedInfo };
}

export async function getFeedFollowsForUser(user_id: string) {
  const userFeedFollows = await db
    .select({ feedName: feeds.name, username: users.name })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
    .innerJoin(users, eq(feedFollows.user_id, users.id))
    .where(eq(feedFollows.user_id, user_id));
  return userFeedFollows;
}
