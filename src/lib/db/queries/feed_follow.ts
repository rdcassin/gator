import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, users } from "../schema";

export async function createFeedFollow(user_id: string, feed_id: string) {
  const [newFeedFollow] = await db
    .insert(feed_follows)
    .values({ user_id: user_id, feed_id: feed_id })
    .returning();
  const [newFeedInfo] = await db
    .select({ feedName: feeds.name, username: users.name })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(eq(feed_follows.id, newFeedFollow.id));
  return { ...newFeedFollow, ...newFeedInfo };
}

export async function getFeedFollowsForUser(user_id: string) {
  const userFeedFollows = await db
    .select({ feedName: feeds.name, username: users.name })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(eq(feed_follows.user_id, user_id));
  return userFeedFollows;
}

export async function deleteFeedFollow(user_id: string, feed_id: string) {
  const [deletedFeedFollow] = await db
  .delete(feed_follows)
  .where(and(eq(feed_follows.feed_id, feed_id), eq(feed_follows.user_id, user_id)))
  .returning();
  return deletedFeedFollow;
}
