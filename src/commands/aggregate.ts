import { fetchFeed } from "src/lib/rss";

export async function handlerAggregate() {
  const feedUrl = "https://www.wagslane.dev/index.xml";
  const feed = await fetchFeed(feedUrl);
  console.log(JSON.stringify(feed, null, 2));
}
