import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost, getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";
import { fetchFeed, RSSItem } from "src/lib/rss";
import { parseDuration } from "src/lib/time";

export async function handlerAggregate(cmdName: string, _user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <TimeDurationAndUnit>`);
  }

  const time = args[0];
  const refreshInterval = parseDuration(time);
  if (!refreshInterval) {
    throw new Error(`TimeDurationAndUnit should be in XXh YYm ZZs or AAms`);
  }

  console.log(`Collecting feeds every ${time}...`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, refreshInterval);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    throw new Error("all feeds have been updated");
  }

  await markFeedFetched(nextFeed.id);
  const feed = await fetchFeed(nextFeed.url);

  if (!feed) {
    throw new Error("failed to fetch feed");
  }

  await savePostsFromFeed(feed.channel.item, nextFeed.id);
}

async function savePostsFromFeed(items: RSSItem[], feedId: string) {
  for (const item of items) {
    try {
      const postData = parseRSSItem(item);
      if (!postData) {
        continue;
      }

      await createPost(
        postData.url,
        feedId,
        postData.title,
        postData.description,
        postData.published_at
      );
      console.log(`Saved post: ${postData.title}`);
    } catch (error) {
      console.warn(
        `Failed to save post "${item.title || "Unknown"}": ${
          (error as Error).message
        }`
      );
    }
  }
}

function parseRSSItem(item: RSSItem) {
  const title = item.title ?? "untitled post";
  const url = item.link;
  const description = item.description;

  if (!description) {
    console.warn(`Skipping post "${title}": no description`);
    return null;
  }

  const pubDateStr = item.pubDate;
  let published_at = null;
  if (pubDateStr) {
    try {
      published_at = new Date(pubDateStr);
      if (isNaN(published_at.getTime())) {
        published_at = null;
      }
    } catch (error) {
      console.warn(`Failed to parse date: ${pubDateStr}`);
      published_at = null;
    }
  }

  return { title, url, description, published_at };
}

function handleError(error: any) {
  console.error(`An error has occured: ${error.message}`);
}

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit = 2;
  if (args.length > 1) {
    throw new Error(`usage: ${cmdName} <OPTIONAL:ResultLimit>`);
  }
  if (args.length == 1) {
    limit = parseInt(args[0]);
  }

  const userId = user.id;

  const posts = await getPostsForUser(userId, limit);
  if (posts.length === 0) {
    console.log("there are no posts available ...");
    return;
  }
  if (!posts) {
    throw new Error("error fetching posts...");
  }

  for (const post of posts) {
    console.log(`Title: ${post.title}`);
    console.log(`URL: ${post.url}`);
    console.log(`Description: ${post.description}`);
    console.log(`Published: ${post.published_at || 'Unknown'}`);
    console.log('---');
  }
}
