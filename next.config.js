/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Allow framing only by the Safe web app, so Safe owners can open this page as a Safe App.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://app.safe.global" },
        ],
      },
    ]
  },
  // Every old route (strategy pages, bridge, banners, etc.) lands on the withdraw page.
  async redirects() {
    const old = ["/strategies/:path*", "/cellars/:path*", "/vaults/:path*", "/bridge/:path*", "/banners/:path*", "/user-terms", "/privacy-policy"]
    return old.map((source) => ({ source, destination: "/", permanent: false }))
  },
}
