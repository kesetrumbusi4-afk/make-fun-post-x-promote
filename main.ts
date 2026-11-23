// post-x-promote-make-your-own-bounty-01 entry (Node 22, standard library only).
// The entry is the X post itself: one post of the entrant's own on X that quotes
// make.fun's make-your-own-bounty post, with a photo of its own attached, make.fun
// (or the @makefunai tag) and the entrant's play code in its text. This program's
// only job is to hand that post in: it copies POST.json from the repository root
// to /output/POST.json, where the house reads it and then reads the post from X.
// Nothing this program writes about the post is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The house refuses a POST.json whose url is not an X post address, so check
// the shape here and fail loudly instead of handing in a file that cannot pass:
// https://x.com/<handle>/status/<digits> (twitter.com reads the same way).
const postPath = join(BOT_DIR, 'POST.json');
const post = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
if (
  typeof post !== 'object' ||
  post === null ||
  typeof post.url !== 'string' ||
  !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(post.url)
) {
  console.error(`POST.json does not name an X post address: ${postPath}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
