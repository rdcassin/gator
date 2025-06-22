import { readConfig } from "src/config";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed_follow";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <FeedUrl>`)
    }

    const userName = readConfig().currentUserName;
    const user = await getUser(userName);
    if (!user) {
        throw new Error("please login/register before following feeds");
    }
    const userId = user.id;
    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error("feed does not exist... please create feed before following");
    }
    const feedId = feed.id;
    
    const feedFollow = await createFeedFollow(userId, feedId);
    console.log(`${user.name} is now following ${feedFollow.feedName}`);
}

export async function handlerListFollows() {
    const userName = readConfig().currentUserName;
    const user = await getUser(userName);
    if (!user) {
        throw new Error("please login before requesting follows list");
    }
    const userId = user.id;

    const allFollows = await getFeedFollowsForUser(userId);
    console.log(`${userName} is currently following ${allFollows.length} feeds...`);
    console.log("--------------------------------------");
    for (let i = 0; i < allFollows.length; i ++) {
        console.log(`${i + 1}. ${allFollows[i].feedName}`);
    }
    if (allFollows.length > 0) {
        console.log("======================================");
    }
}