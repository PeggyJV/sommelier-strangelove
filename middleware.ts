import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || req.nextUrl.host
  const allowLocal = process.env.ATTRIBUTION_ALLOW_LOCAL === "true"
  const isLocal =
    !!host &&
    (host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      host.endsWith(".local"))
  const allowed =
    !!host &&
    (host.endsWith("somm.finance") ||
      host.endsWith("sommelier.finance") ||
      (allowLocal && isLocal))
  if (!allowed) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const res = NextResponse.next()
  res.headers.set("x-somm-domain", host)
  return res
}

export const config = {
  matcher: [
    "/((?!_next|api/health|api/ingest-rpc|api/rpc-report|favicon.ico).*)",
  ],
}
