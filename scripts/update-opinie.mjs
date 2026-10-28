import { scraper } from "google-maps-review-scraper";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const PLACE_URL =
  "https://www.google.com/maps/place/Anna+Musu%C5%82a+Agent+Nieruchomo%C5%9Bci/@54.57,18.39,17z/data=!4m8!3m7!1s0x6af4f95efc376817:0x72dcf3d6d9266efe!8m2!3d54.57!4d18.39!9m1!1b1";
const OUT = new URL("../data/opinie.json", import.meta.url);

function cleanText(text) {
  return (text ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    return null;
  }
}

const previous = await readPrevious();
const raw = await scraper({ url: PLACE_URL, sort_type: "newest", pages: -1, clean: true });

const reviews = (Array.isArray(raw) ? raw : [])
  .filter((r) => r?.review?.rating)
  .map((r) => ({
    id: r.review_id,
    name: r.author?.name ?? "",
    avatar: r.author?.profile_url ?? null,
    rating: r.review.rating,
    text: cleanText(r.review.text),
    date: Number(r.time?.published) || null,
    reply: r.response?.text?.trim() || null,
  }));

// Requests from GitHub's US servers get some authors anonymised as "A Google User";
// names and photos already known from earlier runs are kept.
const ANONYMOUS = "A Google User";
const known = new Map((previous?.reviews ?? []).map((r) => [r.id, r]));
for (const r of reviews) {
  const old = known.get(r.id);
  if (r.name === ANONYMOUS && old && old.name !== ANONYMOUS) {
    r.name = old.name;
    r.avatar = old.avatar;
  }
}

// Google sometimes answers with an empty or truncated list (rate limiting, layout changes).
// Keeping the last good file means the site never goes blank.
const previousCount = previous?.reviews?.length ?? 0;
if (reviews.length === 0 || reviews.length < previousCount * 0.8) {
  console.error(`Got ${reviews.length} reviews (previously ${previousCount}); keeping the old file.`);
  process.exit(previous ? 0 : 1);
}

const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
const data = {
  updated: new Date().toISOString(),
  total: reviews.length,
  average: Math.round(average * 10) / 10,
  reviewUrl: "https://g.page/r/Cf5uJtnW89xyEBM/review",
  reviews,
};

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(data, null, 1) + "\n");
console.log(`Saved ${reviews.length} reviews, average ${data.average}.`);
