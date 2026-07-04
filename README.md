# GoldenWeft

**Bhagalpuri handloom silk e-commerce platform** — built for artisan weavers in Bhagalpur, India.

🌐 **Live:** [goldenweft-yqrz.vercel.app](https://goldenweft-yqrz.vercel.app)

---

## What it is

GoldenWeft is a full-stack luxury silk store featuring editorial product presentation, a Silk Advisor (AI-style questionnaire), Razorpay payments, order management, and a complete admin dashboard — built to feel like a high-end fashion brand (think Prada-style editorial grids) while celebrating Bhagalpuri handloom craft.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Database | MongoDB Atlas via Prisma ORM |
| Payments | Razorpay |
| Image hosting | Cloudinary |
| Auth | JWT (HTTP-only cookies) — admin + customer |
| Email | Nodemailer |
| Deployment | Vercel |

---

## Pages & Routes

### Storefront
| Route | Description |
|---|---|
| `/` | Homepage — hero, seasonal highlights, shop by style, featured silks |
| `/collections` | Full product catalogue with filters |
| `/product/[slug]` | Product detail page |
| `/seasons` | Collections curated by occasion (Wedding, Diwali, etc.) |
| `/styles` | Collections curated by aesthetic (Traditional, Modern, Gen Z) |
| `/find-your-silk` | Silk Advisor — guided questionnaire |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with Razorpay payment |
| `/wishlist` | Saved products |
| `/legacy` | Brand story |
| `/exports` | B2B export enquiries |
| `/about` | About the brand |
| `/login` | Customer login |
| `/register` | Customer sign up |
| `/account` | Customer account (protected) |

### Admin (`/admin`)
| Route | Description |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/products` | Add / edit / delete products, set stock levels |
| `/admin/orders` | View and manage all orders, update delivery status |
| `/admin/hero` | Manage homepage hero slides |
| `/admin/homepage` | Edit homepage content sections |
| `/admin/advisor` | Manage Silk Advisor questions and logic |
| `/admin/business-inquiries` | View B2B / export enquiries |

---

## Three Modes

| Mode | Who | Access |
|---|---|---|
| **Default (Guest)** | Any visitor | Browse, wishlist, cart, checkout |
| **User** | Registered customers | All of above + `/account`, order history |
| **Admin** | Store owner | `/admin/*` — full store management |

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay account (test mode is fine)
- Cloudinary account

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your values
cp .env.example .env

# 3. Generate Prisma client
npx prisma generate

# 4. Seed the database with sample products
npx tsx scripts/seed.ts

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values.

```env
# MongoDB
DATABASE_URL="mongodb+srv://..."

# Admin auth
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD_HASH=""          # Generate with: node -e "require('bcryptjs').hash('yourpassword',10).then(console.log)"
ADMIN_JWT_SECRET=""             # Any long random string

# Customer auth
USER_JWT_SECRET=""              # Any long random string (different from admin)

# Razorpay
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""      # Secret you set when creating webhook in Razorpay dashboard
NEXT_PUBLIC_RAZORPAY_KEY_ID=""  # Same as RAZORPAY_KEY_ID

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_UPLOAD_PRESET=""

# Email (Nodemailer)
EMAIL_HOST=""
EMAIL_PORT=""
EMAIL_USER=""
EMAIL_PASS=""
EMAIL_TO=""
BUSINESS_EMAIL=""
BUSINESS_EMAIL_PASSWORD=""
BUSINESS_INQUIRY_RECEIVER_EMAIL=""

# Public brand info
NEXT_PUBLIC_BRAND_NAME="GoldenWeft"
NEXT_PUBLIC_WHATSAPP_NUMBER=""
NEXT_PUBLIC_BUSINESS_EMAIL=""
NEXT_PUBLIC_INSTAGRAM_URL=""
NEXT_PUBLIC_LINKEDIN_URL=""
NEXT_PUBLIC_TELEGRAM_USERNAME=""
```

### Generating `ADMIN_PASSWORD_HASH`

```bash
node -e "require('bcryptjs').hash('YOUR_PASSWORD_HERE', 10).then(h => console.log(h))"
```

Copy the output (starts with `$2b$10$`) and paste it as `ADMIN_PASSWORD_HASH`.

> ⚠️ When adding to Vercel, paste the raw hash **without quotes** — Vercel handles `$` correctly when typed directly in the UI.

---

## One-time Database Scripts

Run these once after first deployment if you have existing data:

```bash
# Backfill stock field on existing products (sets placeholder of 8)
npm run migrate:product-stock

# Migrate old order statuses to new format
npm run migrate:order-status
```

> These scripts require a direct MongoDB connection. If you get a DNS error on Windows, run them from the MongoDB Compass shell instead — see instructions in `scripts/` folder comments.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env` in Vercel → Settings → Environment Variables
4. Vercel auto-runs `prisma generate` via `postinstall` before each build
5. Deploy

> After deploying, create a Razorpay webhook pointing to `https://yourdomain.com/api/payment/webhook` and set the same secret as `RAZORPAY_WEBHOOK_SECRET`.

---

## Testing Payments (Razorpay Test Mode)

Use these credentials when `RAZORPAY_KEY_ID` is a test key (`rzp_test_...`):

| Method | Details |
|---|---|
| **Card** | `5267 3181 8797 5449` · Expiry `12/26` · CVV `123` |
| **OTP** | `1234` |
| **UPI** | `success@razorpay` (success) · `failure@razorpay` (failure) |
| **Netbanking** | Select any bank → click Success on the test page |

Switch to live mode by replacing test keys with live keys from Razorpay dashboard.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes (auth, payment, orders, etc.)
│   └── ...               # Storefront pages
├── components/
│   ├── home/             # Homepage sections
│   ├── layout/           # Header, footer
│   └── product/          # Product card, gallery
└── lib/
    ├── auth.ts           # JWT session helpers (admin + user)
    ├── prisma.ts         # Prisma client singleton
    └── queries/          # Database query helpers
prisma/
└── schema.prisma         # MongoDB schema (Product, Order, User, etc.)
scripts/
└── *.ts                  # One-time migration and seed scripts
```

---
