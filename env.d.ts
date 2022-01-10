// make sure to sync with .env.example file
declare namespace NodeJS {
  interface ProcessEnv {
    readonly SENTRY_DSN: string
    readonly NEXT_PUBLIC_SENTRY_DSN: string
  }
}
