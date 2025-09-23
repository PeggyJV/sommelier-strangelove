export const runtime = "nodejs"

async function sendTelegram(token: string, chatId: string, text: string) {
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
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return Response.json(
      { ok: false, error: "Missing TELEGRAM_* envs" },
      { status: 500 }
    )
  }

  const url = new URL(req.url)
  let text = `Alpha daily ping ✅ ${new Date().toISOString()}`
  const q = url.searchParams.get("text")
  if (q) text = q.slice(0, 3800)

  const { ok, status, payload } = await sendTelegram(token, chatId, text)
  if (!ok) {
    console.error("TELEGRAM_SEND_FAIL", { status, payload })
    return Response.json({ ok: false, status, payload }, { status: 502 })
  }
  console.log("TELEGRAM_SEND_OK", {
    status,
    message_id: payload?.result?.message_id,
    chat: payload?.result?.chat?.id,
  })
  return Response.json({ ok: true, status, message_id: payload?.result?.message_id })
}


