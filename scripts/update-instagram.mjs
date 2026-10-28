import { readFile, writeFile, mkdir } from "node:fs/promises";

// Behold's free plan counts every feed request as a view; fetching once a day here
// and serving our own copy keeps the site far below the monthly limit.
const FEED_ID = process.env.BEHOLD_FEED_ID;
const OUT = new URL("../data/instagram.json", import.meta.url);

if (!FEED_ID) {
  console.log("BEHOLD_FEED_ID not set; skipping Instagram update.");
  process.exit(0);
}

const res = await fetch(`https://feeds.behold.so/${FEED_ID}`);
if (!res.ok) {
  console.error(`Behold responded ${res.status}; keeping the old file.`);
  process.exit(0);
}
const feed = await res.json();

const posts = (feed.posts ?? []).map((p) => ({
  id: p.id,
  url: p.permalink,
  isVideo: p.mediaType === "VIDEO" || Boolean(p.isReel),
  image: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl,
  caption: (p.prunedCaption ?? p.caption ?? "").slice(0, 200),
  date: p.timestamp ?? null,
}));

if (posts.length === 0) {
  console.error("Behold returned no posts; keeping the old file.");
  process.exit(0);
}

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(
  OUT,
  JSON.stringify(
    {
      updated: new Date().toISOString(),
      username: feed.username ?? "anna.musula.realestate",
      profileUrl: `https://www.instagram.com/${feed.username ?? "anna.musula.realestate"}/`,
      posts,
    },
    null,
    1
  ) + "\n"
);
console.log(`Saved ${posts.length} Instagram posts.`);
