import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feeds, posts, feed_follows } from "../schema";
import { singleItemOrUndefined } from "./utils";

export async function createPost(
  url: string,
  feed_id: string,
  title: string,
  description: string,
  published_at: Date | null
) {
  const result = await db
    .insert(posts)
    .values({ title, url, description, published_at, feed_id })
    .returning();
  return singleItemOrUndefined(result);
}

export async function getPostsForUser(user_id: string, limit: number) {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      published_at: posts.published_at,
      feed_id: posts.feed_id,
      feed_name: feeds.name
    })
    .from(posts)
    .innerJoin(feeds, eq(feeds.id, posts.feed_id))
    .innerJoin(feed_follows, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, user_id))
    .orderBy(desc(posts.published_at))
    .limit(limit);
  return result;
}
