export const runtime = "nodejs"

import { buildDailyMessage } from "../../../src/lib/telegram/buildDailyMessage"

function trimSafe(s: string) {
  return s.length > 3800 ? s.slice(0, 3800) : s
}

async function sendTelegram(
  token: string,
  chatId: string,
  text: string
) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const body = new URLSearchParams({ chat_id: chatId, text })
  const res = await fetch(url, { method: "POST", body })
  let payload: any = null
  try {
    payload = await res.json()
  } catch {}
  return { ok: res.ok, status: res.status, payload }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode = (url.searchParams.get("mode") || "live").toLowerCase()
  const forDate = url.searchParams.get("forDate") || undefined
  const tz = url.searchParams.get("tz") || "Europe/Tallinn"

  const token = process.env.TELEGRAM_BOT_TOKEN || ""
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").trim()
  if (!token || !chatId) {
    return Response.json(
      { ok: false, error: "Missing TELEGRAM_* envs", tokenSet: !!token, chatId },
      { status: 500 }
    )
  }

  // Build the REAL message via shared builder (same as cron path)
  let text = await buildDailyMessage({ forDate, tz })
  text = trimSafe(text)

  if (mode === "preview") {
    return Response.json(
      { ok: true, preview: true, forDate: forDate ?? "now", tz, text },
      { status: 200 }
    )
  }

  // Live send
  const { ok, status, payload } = await sendTelegram(token, chatId, text)
  if (!ok) {
    console.error("TELEGRAM_SEND_FAIL", { status, payload })
    return Response.json(
      { ok: false, status, payload },
      { status: 502 }
    )
  }
  console.log("TELEGRAM_SEND_OK", {
    status,
    message_id: payload?.result?.message_id,
    chat: payload?.result?.chat?.id,
  })
  return Response.json({
    ok: true,
    status,
    message_id: payload?.result?.message_id,
    text,
  })
}
