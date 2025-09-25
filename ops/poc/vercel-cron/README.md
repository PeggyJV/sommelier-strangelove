# Vercel Cron — Daily Telegram

Posts one Telegram message per day at 06:05 UTC.

## Env (Vercel Project → Settings → Environment Variables)

- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID (numeric id or @handle; channels often `-100…`)

## Deploy

```bash
cd ops/poc/vercel-cron
vercel --prod
```

## Manual test

```bash
curl -s https://<your-app>.vercel.app/api/daily-telegram
# or with custom text:
curl -s "https://<your-app>.vercel.app/api/daily-telegram?text=Alpha%20live%20sanity%20✅"
```

## Logs

Vercel Dashboard → Functions → Logs. Scheduled runs execute daily at 06:05 UTC (~09:05 Tallinn).
