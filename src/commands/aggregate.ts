import { fetchFeed } from "src/lib/rss";

export async function handlerAggregate() {
  const feedURL = "https://www.wagslane.dev/index.xml";
  const feed = await fetchFeed(feedURL);
  console.log(JSON.stringify(feed, null, 2));
}
