# On-chain Marketing Scripts

Purpose:
- Extract vault user addresses via Alchemy transfers
- Mark Active vs Previous holders via on-chain balanceOf
- Generate Debank CSV payloads
- Send test messages via Debank group_send

Usage:
```
pnpm holders:alchemy
pnpm mark:active
pnpm msgs:gen
pnpm debank:test
```

Env:
- Create scripts/onchain-marketing/.env.local by copying .env.example
- You can fetch production env via: vercel env pull .env.vercel
- Copy relevant keys into .env.local
