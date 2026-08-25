# Urban Repair Expert — Complete Platform

Premium, mobile-first website for **appliance repair bookings** and **old AC / refrigerator buyback**, built with Next.js 15 + Supabase.

## Features

**Customer**
- One-page homepage with dual CTAs (Book Repair / Sell Now)
- 3-step booking flow (< 60s): appliance → schedule → address + GPS + photo
- 9-step sell wizard with live price engine (up to 20% uplift), photo/video upload, GPS pickup
- Booking tracking by ID or mobile (`/track`)
- Blog, FAQs, testimonials, Google reviews block, service areas (local SEO)
- Click-to-call + WhatsApp everywhere, mobile sticky action bar
- reCAPTCHA-ready forms, honeypot spam protection

**Admin Panel** (`/admin`)
- Live dashboard: totals, pending/completed/cancelled, today's new, realtime toast notifications
- Repair bookings manager: search/filter, call/WhatsApp/Maps one-tap actions, assign technician, status workflow, invoice generation (print/PDF)
- Sell requests manager: photos review, estimated vs offer value, schedule pickup, assign pickup partner, mark purchased
- Price Engine: brands → models → capacities base values, age & condition multipliers, global uplift %
- Technician account creation

**Technician Portal** (`/technician`)
- Assigned jobs list, status progression (assigned → on the way → in progress → completed)
- Call / WhatsApp / Navigate buttons, before/after/invoice photo upload, mark purchased for pickups

---

## Setup

### 1. Install & run

```bash
npm install
npm run dev
```

The site works instantly in **demo mode** (bookings fall back to WhatsApp deep links) — no database required.

### 2. Supabase (5 minutes, free)

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run.
   This creates all tables, RLS policies, triggers, the `uploads` storage bucket and seed pricing data.
3. **Settings → API**: copy Project URL + anon key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # needed only to create technician accounts from admin panel
```

4. Create your admin login:
   - **Authentication → Users → Add user** (email + password, auto-confirm)
   - Then in SQL Editor run:
   ```sql
   update public.profiles set role = 'admin' where id = (
     select id from auth.users where email = 'you@example.com'
   );
   ```
5. Sign in at `/admin`.

### 3. Business details

Edit `lib/config.ts` — phone, WhatsApp number, email, full address, city, service areas, Google reviews URL, socials. All placeholders are centralized there.

### 4. Analytics / marketing (optional)

Add to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX          # Google Analytics 4
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX    # Meta Pixel
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=…  # Search Console
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=…
RECAPTCHA_SECRET_KEY=…
ADMIN_WEBHOOK_URL=…                     # optional: instant POST on every new booking/sell (Slack/Telegram/Zapier)
```

reCAPTCHA v3 activates automatically when both keys exist.

### 5. Deploy (Vercel)

```bash
git init && git add . && git commit -m "Urban Repair Expert platform"
```

Push to GitHub → import in Vercel → add the same env vars → deploy. Point your domain, verify in Search Console, submit `/sitemap.xml`.

---

## Pricing engine logic

```
market = capacity.base_value × age.multiplier × condition.multiplier   (rounded to ₹10)
offer  = market × (1 + uplift%)                                        (rounded to ₹10)
```

Example: 190 L fridge base ₹2,100 · 3–5 yrs (×0.85) · Good (×0.85) → market ≈ ₹1,520 → offer ≈ ₹1,820 (**+20% uplift**). Everything is editable live from **Admin → Price Engine**; changes reflect instantly on the site.

## Notes

- **OTP verification**: UI validates Indian mobile numbers; to enable true SMS OTP later, plug a provider (MSG91/Twilio) into the booking server action — schema needs no change.
- **Payments**: intentionally skipped per requirements; add Razorpay checkout in the booking success step when ready.
- **Estimate disclaimer**: sell values are shown as estimates with "final offer after inspection" messaging throughout (required for compliance).

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Framer Motion · Supabase (Postgres, Auth, Storage, Realtime) · lucide-react


### Google Reviews auto-sync (optional)

Website ka Google rating/review count live sync karne ke liye:

```env
GOOGLE_PLACES_API_KEY=your_places_api_key
NEXT_PUBLIC_GOOGLE_PLACE_ID=your_business_place_id
```

Place ID nikaalne ke liye: [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id) pe business name search karo. Keys add hone ke baad section hourly auto-update hota hai. Without keys, `lib/config.ts` ke `ratingValue` / `reviewCount` values dikhte hain — inhe apne real Google Business Profile numbers se update kar lena.

### Rate Card

`/rates` page par AC ka complete rate card hai — prices `lib/data/rate-card.ts` me edit kar sakte ho. Fridge / Washing Machine / Geyser cards isi structure me add honge.