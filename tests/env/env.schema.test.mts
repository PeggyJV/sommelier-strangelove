import { describe, it, expect } from "@jest/globals"
import { EnvSchema } from "../../scripts/env/env.schema.mts"

describe("EnvSchema", () => {
  it("fails on missing TELEGRAM_BOT_TOKEN", () => {
    const { success, error } = EnvSchema.safeParse({
      TELEGRAM_CHAT_ID: "123",
      START_BLOCK_ALPHA_STETH: "0",
      UPSTASH_REST_URL: "https://example.com",
      UPSTASH_REST_TOKEN: "x",
      NODE_ENV: "test",
    })
    expect(success).toBe(false)
    expect(
      error?.errors.some(
        (e) => String(e.path) === "TELEGRAM_BOT_TOKEN"
      )
    ).toBe(true)
  })

  it("accepts numeric chat id and coerced block", () => {
    const { success } = EnvSchema.safeParse({
      TELEGRAM_BOT_TOKEN: "t",
      TELEGRAM_CHAT_ID: "123456789",
      START_BLOCK_ALPHA_STETH: "23300000",
      UPSTASH_REST_URL: "https://u.io",
      UPSTASH_REST_TOKEN: "x",
      NODE_ENV: "test",
    })
    expect(success).toBe(true)
  })
})
