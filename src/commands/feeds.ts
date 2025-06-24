import { createFeedFollow } from "src/lib/db/queries/feed_follow";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <NameOfFeed> <FeedUrl>`);
  }

  const feedName = args[0];
  const feedUrl = args[1];
  const userId = user.id;

  const feed = await createFeed(feedName, feedUrl, userId);
  if (!feed) {
    throw new Error("feed already exists in database");
  }

  printFeed(feed, user);
  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`${user.name} is now following ${feedFollow.feedName}`);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:          ${feed.id}`);
  console.log(`* Created:     ${feed.created_at}`);
  console.log(`* Updated:     ${feed.updated_at}`);
  console.log(`* name:        ${feed.name}`);
  console.log(`* URL:         ${feed.url}`);
  console.log(`* User:        ${user.name}`);
}

export async function handlerListFeeds(_cmdName: string, _user: User, ..._args: string[]) {
  const feeds = await getFeeds();
  const numOfFeeds = feeds.length;

  if (numOfFeeds === 0) {
    console.log("No feeds founds");
    return;
  }

  console.log(`Displaying ${numOfFeeds} feeds.`);

  for (let feed of feeds) {
    const user = await getUserById(feed.user_id);
    if (!user) {
      throw new Error(`failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log("================================");
  }
}
