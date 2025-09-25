import "dotenv/config"

const redacted = (k) =>
  k.toLowerCase().includes("token") || k.toLowerCase().includes("url")

const keys = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "START_BLOCK_ALPHA_STETH",
  "UPSTASH_REST_URL",
  "UPSTASH_REST_TOKEN",
  "NODE_ENV",
]

console.log("ENV audit:")
for (const k of keys) {
  const v = process.env[k]
  const out =
    v == null || v === ""
      ? "<missing>"
      : redacted(k)
      ? "<set>"
      : String(v)
  console.log(`- ${k}: ${out}`)
}
process.exit(0)
