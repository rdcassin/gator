import { readConfig } from "src/config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function addFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <NameOfFeed> <FeedURL>`);
  }

  const feedName = args[0];
  const feedUrl = args[1];
  const userName = readConfig().currentUserName;
  const user = await getUser(userName);
  const userID = user.id;

  const feed = await createFeed(feedName, feedUrl, userID);
  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`${feed.name}: ${feed.url} added for ${user.name}`);
}
