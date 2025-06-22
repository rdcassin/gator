import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(userID: string, feedID: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userID: userID, feedID: feedID }).returning();
    const [ids] = await db.select({ feedName: feeds.name, username: users.name }).from(feedFollows).innerJoin(feeds, eq(feedFollows.feedID, feeds.id)).innerJoin(users, eq(feedFollows.userID, users.id));
    return {...newFeedFollow, ...ids};
}