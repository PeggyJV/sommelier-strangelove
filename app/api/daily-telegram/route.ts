export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { spawn } from "node:child_process"
import { resolve } from "node:path"

async function run(
  cmd: string,
  args: string[],
  env: Record<string, string>
) {
  return await new Promise<{
    code: number
    stdout: string
    stderr: string
  }>((resolveP) => {
    const p = spawn(cmd, args, {
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    })
    let out = "",
      err = ""
    p.stdout.on("data", (d) => (out += d.toString()))
    p.stderr.on("data", (d) => (err += d.toString()))
    p.on("close", (code) =>
      resolveP({
        code: (code ?? 0) as number,
        stdout: out.trim(),
        stderr: err.trim(),
      })
    )
  })
}

export async function GET(req: Request) {
  const u = new URL(req.url)
  const mode = (u.searchParams.get("mode") || "live").toLowerCase() // preview | live
  const forDate = u.searchParams.get("forDate") || undefined
  const tz = u.searchParams.get("tz") || "Europe/Tallinn"

  const script = resolve(
    "scripts/analytics/export-alpha-deposits.mjs"
  )
  const args = [script]
  if (forDate) args.push("--forDate", forDate)
  if (tz) args.push("--tz", tz)

  if (mode === "preview") {
    const { code, stdout, stderr } = await run(
      process.execPath,
      args,
      {
        TELEGRAM_PREVIEW: "1",
        TELEGRAM_MODE: "strict",
      }
    )
    if (code !== 0) {
      return Response.json(
        { ok: false, status: 500, error: "preview_failed", stderr },
        { status: 500 }
      )
    }
    return Response.json(
      { ok: true, preview: true, text: stdout },
      { status: 200 }
    )
  }

  // live: first compose exact text in strict mode
  const composed = await run(process.execPath, args, {
    TELEGRAM_PREVIEW: "1",
    TELEGRAM_MODE: "strict",
  })
  if (composed.code !== 0 || !composed.stdout) {
    return Response.json(
      {
        ok: false,
        status: 500,
        error: "compose_failed",
        stderr: composed.stderr || "no stdout",
      },
      { status: 500 }
    )
  }
  const text = composed.stdout

  // minimal same-day idempotency (process-local)
  const todayKey = `sent-${new Date().toISOString().slice(0, 10)}`
  ;(globalThis as any).__daily_sent ||= new Set<string>()
  if ((globalThis as any).__daily_sent.has(todayKey)) {
    return Response.json(
      { ok: true, status: 200, message: "already_sent_today", text },
      { status: 200 }
    )
  }

  const liveArgs = [...args, "--post-telegram"]
  const { code, stdout, stderr } = await run(
    process.execPath,
    liveArgs,
    { TELEGRAM_MODE: "strict" }
  )
  if (code !== 0) {
    return Response.json(
      { ok: false, status: 502, error: "send_failed", stderr },
      { status: 502 }
    )
  }
  ;(globalThis as any).__daily_sent.add(todayKey)
  return Response.json(
    { ok: true, status: 200, message: "sent", text },
    { status: 200 }
  )
}
