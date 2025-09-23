import "dotenv/config"
import { z } from "zod"

const numericString = z
  .string()
  .regex(/^\d+$/)
  .or(z.number().int().nonnegative())

export const EnvSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN missing"),
  TELEGRAM_CHAT_ID: z.union([numericString, z.string().min(1)]),
  START_BLOCK_ALPHA_STETH: z.coerce.number().int().nonnegative(),
  UPSTASH_REST_URL: z.string().url(),
  UPSTASH_REST_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]),
})

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const lines = parsed.error.errors.map(
      (e) => `- ${e.path.join(".")} – ${e.message}`
    )
    const msg = [
      "ENV validation failed:",
      ...lines,
      "",
      "Tip: verify GitHub Actions secrets and local .env match exact keys.",
    ].join("\n")
    console.error(msg)
    process.exit(1)
  }
  return parsed.data as Env
}
