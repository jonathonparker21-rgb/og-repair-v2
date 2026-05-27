# OG Repair Manager

Custom repair shop management system for OG Repair (phones + computers).

Built with Cloudflare Workers + D1 + Hono.

## Features (Current)
- Clean intake form matching your exact workflow
- Customer name + phone
- Device: Brand, Model, IMEI/Serial
- Problem description + Estimate amount
- Print Intake Agreement with signature line
- Modern dark UI optimized for shop use

## Next Steps (Planned)
- Connect form to real D1 database (create customer/device/repair)
- Search existing customers
- Full repair ticket tracking
- Inventory management
- Sales / Plans module

## Setup Instructions

1. Clone this repo
2. Run `npm install`
3. Make sure `wrangler.toml` has your correct D1 `database_id`
4. Apply the database schema:
   ```bash
   wrangler d1 execute og-repair-db --file=./schema.sql
   ```
5. Deploy:
   ```bash
   wrangler deploy
   ```

## Local Development
```bash
wrangler dev
```

## Tech Stack
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Hono (routing)
- Tailwind CSS (via CDN for simplicity)

---

Built for OG Repair • 2026
