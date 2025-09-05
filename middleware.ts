import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || req.nextUrl.host
  const allowed = host && (host.endsWith("somm.finance") || host.endsWith("sommelier.finance"))
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
