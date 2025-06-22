import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follow";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <FeedUrl>`);
  }

  const userId = user.id;
  const url = args[0];
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(
      "feed does not exist... please create feed before following"
    );
  }
  const feedId = feed.id;

  const feedFollow = await createFeedFollow(userId, feedId);
  console.log(`${user.name} is now following ${feedFollow.feedName}`);
}

export async function handlerListFollows(_cmdName: string, user: User, ..._args: string[]) {
  const userId = user.id;

  const allFollows = await getFeedFollowsForUser(userId);
  console.log(
    `${user.name} is currently following ${allFollows.length} feed(s)...`
  );
  if (allFollows.length > 0) {
    console.log("--------------------------------");
    for (let i = 0; i < allFollows.length; i++) {
      console.log(`* ${i + 1}.          ${allFollows[i].feedName}`);
    }
    console.log("================================");
  }
}
