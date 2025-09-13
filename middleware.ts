import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const host = (
    req.headers.get("host") ||
    req.nextUrl.host ||
    ""
  ).toLowerCase()
  const isLocal =
    host.includes("localhost") || host.startsWith("127.0.0.1")
  const allowed =
    host &&
    (isLocal ||
      host.endsWith("somm.finance") ||
      host.endsWith("sommelier.finance") ||
      host.endsWith(".vercel.app"))
  if (!allowed) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const res = NextResponse.next()
  res.headers.set("x-somm-domain", host)
  return res
}

export const config = {
  matcher: ["/((?!_next|api/health|favicon.ico).*)"],
}
