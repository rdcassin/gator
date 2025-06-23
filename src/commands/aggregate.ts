import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";
import { parseDuration } from "src/lib/time";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <TimeDurationAndUnit>`);
  }

  const time = args[0];
  const refreshInterval = parseDuration(time);
  if (!refreshInterval) {
    throw new Error(`TimeDuractionAndUnit should be in XXh YYm ZZs or AAms`);
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

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    throw new Error("all feeds have been updated");
  }

  const feedId = nextFeed.id;
  const updatedFeed = await markFeedFetched(feedId);
  if (!updatedFeed) {
    throw new Error("failed to update feed");
  }

  const feed = await fetchFeed(nextFeed.url);
  if (!feed) {
    throw new Error("failed to fetch feed");
  }

  const items = feed.channel.item;
  console.log(`${feed.channel.title} contains ${items.length} titles`);
  for (let i = 0; i < items.length; i++) {
    console.log(`${i}.   ${items[i].title}`);
  }
}

function handleError(error: any) {
  console.error(`An error has occured: ${error.message}`);
}