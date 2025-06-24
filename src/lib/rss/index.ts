import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
  const res = await fetch(feedUrl, {
    method: "GET",
    mode: "cors",
    headers: {
      "User-Agent": "gator",
    },
  });
  if (!res.ok) {
    throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const xmlString = await res.text();
  const parsedObj = xmlParse(xmlString);
  const channel = extractChannel(parsedObj);
  const chMetadata = extractMetadata(channel);
  const items = extractItems(channel);
  return {
    channel: {
      title: chMetadata.title,
      link: chMetadata.link,
      description: chMetadata.description,
      item: items,
    },
  };
}

function xmlParse(xmlString: string) {
  const parser = new XMLParser();
  return parser.parse(xmlString);
}

function extractChannel(parsedObj: any) {
  if (!parsedObj.rss.channel) {
    throw new Error("no channel found");
  }
  return parsedObj.rss.channel;
}

function extractMetadata(channel: any) {
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("title, link, and/or description missing");
  }
  return {
    title: channel.title,
    link: channel.link,
    description: channel.description,
  };
}

function extractItems(channel: any) {
  let items = channel.item;
  if (!Array.isArray(channel.item)) {
    items = items ? [items] : [];
  }

  const valid: RSSItem[] = [];
  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }
    valid.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }
  return valid;
}
