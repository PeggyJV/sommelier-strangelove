import "dotenv/config"
import { EnvSchema } from "./env.schema.mts"

const result = EnvSchema.safeParse(process.env)

if (!result.success) {
  console.error("ENV validation failed.\n")
  for (const err of result.error.errors) {
    console.error(`- ${err.path.join(".")}: ${err.message}`)
  }
  process.exit(2)
}

const redact = (k: string, v: string | number | undefined) =>
  k.toLowerCase().includes("token") ? "<redacted>" : String(v ?? "")

const data = result.data as Record<string, unknown>
console.log("ENV validation passed. Resolved keys:")
Object.keys(data)
  .sort()
  .forEach((k) => {
    console.log(`- ${k}: ${redact(k, data[k] as any)}`)
  })
