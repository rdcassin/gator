import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
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
    console.log(`* ID:          ${feed.id}`);
    console.log(`* Created:     ${feed.createdAt}`);
    console.log(`* Updated:     ${feed.updatedAt}`);
    console.log(`* name:        ${feed.name}`);
    console.log(`* URL:         ${feed.url}`);
    console.log(`* User:        ${user.name}`);
}

export async function handlerListFeeds() {
  const feeds = await getFeeds();
    const numOfFeeds = feeds.length;

    if (numOfFeeds === 0) {
        console.log("No feeds founds");
        return;
    }

    console.log(`Displaying ${numOfFeeds} feeds.`);
    
  for (let feed of feeds) {
    const user = await getUserById(feed.userID);
    if (!user) {
        throw new Error(`failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log("================================");
  }
}
