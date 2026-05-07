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

  const response = NextResponse.next()
  response.headers.set("x-somm-domain", host)
  return response
}

export const config = {
  matcher: ["/((?!_next|api/health|favicon.ico).*)"],
}
