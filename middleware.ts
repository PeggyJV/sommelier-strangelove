import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { analyticsMiddleware } from "./src/middleware/analytics"

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

  // Apply analytics middleware first
  const analyticsResponse = analyticsMiddleware(req)
  
  // Add domain header to analytics response
  analyticsResponse.headers.set("x-somm-domain", host)
  
  return analyticsResponse
}

export const config = {
  matcher: ["/((?!_next|api/health|favicon.ico).*)"],
}
