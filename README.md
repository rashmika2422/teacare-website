# 📋 Teacare Services Pvt Ltd — Developer & Maintenance Guide

Welcome to the official developer and administrator guide for the **Teacare Services Pvt Ltd** website. This document covers how to run, modify, and deploy the platform.

---

## 📁 1. Project Structure

```text
Teacare_website/
├── README.md                        # This guide
│
├── teacare-nextjs/                  # ── FRONTEND (Next.js + TypeScript) ──
│   ├── app/
│   │   ├── layout.tsx               # Root HTML layout (fonts, metadata, AOS)
│   │   ├── page.tsx                 # Main page — assembles all section components
│   │   ├── globals.css              # Full site stylesheet (all styles live here)
│   │   └── favicon.ico
│   ├── components/                  # Individual page section components (TSX)
│   │   ├── Header.tsx               # Fixed navigation bar + burger menu
│   │   ├── Hero.tsx                 # Hero section with typewriter animation
│   │   ├── About.tsx                # About / Who We Are section
│   │   ├── Experience.tsx           # Stats dashboard + parallax image card
│   │   ├── Services.tsx             # 4 service vertical cards
│   │   ├── Gallery.tsx              # 3D parallax gallery
│   │   ├── Estimator.tsx            # Interactive event planner / price estimator
│   │   ├── Appointment.tsx          # Calendar booking form (sends to backend API)
│   │   ├── Testimonials.tsx         # Client review cards
│   │   ├── Contact.tsx              # Contact form (sends to backend API)
│   │   ├── Footer.tsx               # Footer
│   │   └── ScrollProgress.tsx       # Gold scroll progress bar
│   ├── public/
│   │   └── assets/images/           # Local brand & event images
│   ├── next.config.ts               # API proxy rewrite → backend port 8000
│   ├── .env.local                   # Frontend environment variables
│   └── package.json
│
└── teacare-backend/                 # ── BACKEND (Node.js / Express API) ──
    ├── server.js                    # Express server entry point
    ├── routes/
    │   └── appointmentRoutes.js     # POST /api/appointments, GET, POST /reply
    ├── controllers/
    │   └── appointmentController.js # Email logic (Resend), sentiment analysis
    ├── models/
    │   └── appointment.js           # In-memory appointment store
    ├── middleware/
    │   └── errorHandler.js          # Global error handler
    ├── .env                         # API keys & notification email
    └── package.json
```

---

## 🚀 2. How to Run Locally

You need **two terminals running at the same time**.

### Terminal 1 — Backend API Server
```bash
cd teacare-backend
npm install        # first time only
npm start
```
> ✅ Runs on **http://localhost:8000**
> You will see: `🚀 Server live on http://127.0.0.1:8000`

### Terminal 2 — Frontend (Next.js)
```bash
cd teacare-nextjs
npm install        # first time only
npm run dev
```
> ✅ Runs on **http://localhost:3000** ← Open this in your browser

> [!IMPORTANT]
> Both servers must be running simultaneously. The Next.js frontend automatically proxies all `/api/*` requests to the backend on port 8000 via `next.config.ts`.

---

## ✍️ 3. How to Edit Text & Content

All page sections are individual TypeScript components inside `teacare-nextjs/components/`.

| Section to Edit | File to Open |
|:---|:---|
| Navigation links | `components/Header.tsx` |
| Hero title / subtitle / description | `components/Hero.tsx` |
| About Us text & value cards | `components/About.tsx` |
| Stats (99.8%, 150+, 5-Star) | `components/Experience.tsx` |
| Service card titles & descriptions | `components/Services.tsx` |
| Gallery event cards & captions | `components/Gallery.tsx` |
| Estimator packages & tiers | `components/Estimator.tsx` |
| Appointment form & calendar | `components/Appointment.tsx` |
| Testimonial reviews & names | `components/Testimonials.tsx` |
| Contact details (address, phone, email) | `components/Contact.tsx` |
| Footer copyright text | `components/Footer.tsx` |

**To make words appear gold**, wrap them in:
```tsx
<span className="gold-gradient-text">Your Text Here</span>
```

---

## 🖼️ 4. How to Change Images

All local images are stored in: `teacare-nextjs/public/assets/images/`

### Replace an existing image (e.g. logo):
1. Copy your new image into `public/assets/images/`
2. Open the relevant component (e.g. `Header.tsx`)
3. Find the `src` attribute and update the filename:
```tsx
// Before
<img src="/assets/images/IMG_8664.jpeg" ... />

// After
<img src="/assets/images/your-new-logo.png" ... />
```

### Change a background image:
Find the component and update the `style` prop:
```tsx
<div style={{ backgroundImage: "url('/assets/images/your-image.jpg')" }} />
```

---

## 🎨 5. How to Change Styles & Colors

All styles are in one file: **`teacare-nextjs/app/globals.css`**

The color palette is defined at the top using CSS variables:
```css
:root {
    --dark-gray: #1a202c;       /* Main dark background */
    --light-gray: #f7fafc;      /* Light section background */
    --solid-gold: #f39c12;      /* Primary gold accent */
    --neon-teal: #00cecb;       /* Teal highlight */
    --royal-purple: #6c5ce7;    /* Purple accent */
    --mid-gray: #4a5568;        /* Body text */
}
```

Change `--solid-gold` to update the gold color across the entire site.

---

## 🗓️ 6. Appointment Booking & Email System

### How it works
1. Visitor fills in the calendar booking form (`Appointment.tsx`)
2. On submit, a `POST /api/appointments` request is sent to the backend
3. The backend sends two emails via **Resend**:
   - **Admin email** → `📅 [Appointment Booking]` notification with full details
   - **Client email** → confirmation copy sent to the visitor's email address
4. The Contact Us form works identically with `📩 [General Inquiry]` emails

### Email configuration — `teacare-backend/.env`
```env
PORT=8000
RESEND_API_KEY=your_resend_api_key_here
NOTIFICATION_EMAIL=your@email.com
```

- `NOTIFICATION_EMAIL` — where admin notifications are delivered (comma-separate for multiple: `a@x.com,b@x.com`)
- `RESEND_API_KEY` — your secret key from [resend.com](https://resend.com). **Never share this publicly.**

### Changing the notification email
1. Log into [resend.com](https://resend.com) → **Settings → Verified Addresses**
2. Add and verify your new email address
3. Update `NOTIFICATION_EMAIL` in `teacare-backend/.env`
4. Restart the backend (`Ctrl+C` then `npm start`)

> [!NOTE]
> Resend's free plan only delivers to verified email addresses. If emails land in spam, open iCloud/Gmail → Spam → mark as "Not Junk" to train the filter.

---

## ☁️ 7. Production Deployment

### Option A — Split Hosting (Recommended)

| Part | Host On | Command |
|:---|:---|:---|
| **Frontend** (`teacare-nextjs/`) | [Vercel](https://vercel.com) | `npm run build` → deploy |
| **Backend** (`teacare-backend/`) | [Render](https://render.com) or Railway | `npm start` |

After deploying the backend, update `teacare-nextjs/next.config.ts` to point to your live backend URL:
```ts
destination: 'https://your-backend.onrender.com/api/:path*',
```

### Option B — Single VPS (EC2 / DigitalOcean)
1. Upload both folders to the server
2. Run `npm install` in each folder
3. Start backend: `npm start` (inside `teacare-backend/`)
4. Build & start frontend: `npm run build && npm start` (inside `teacare-nextjs/`)
5. Use **nginx** to reverse-proxy port 80 → 3000 (frontend) and `/api` → 8000 (backend)

---

## 🛠️ 8. Troubleshooting

### ⚠️ Forms submit but no emails arrive
- Check `teacare-backend/.env` has a valid `RESEND_API_KEY`
- Ensure `NOTIFICATION_EMAIL` is verified in your Resend dashboard
- Restart the backend after any `.env` change
- Check your **Spam / Junk** folder

### ⚠️ "Network Error: Cannot connect to server"
- The backend is not running — open a terminal and run `npm start` in `teacare-backend/`
- Check both servers are running (port 3000 for frontend, port 8000 for backend)

### ⚠️ Frontend shows unstyled / broken layout
- Ensure `teacare-nextjs/app/globals.css` exists and is imported in `layout.tsx`
- Run `npm run dev` from inside the `teacare-nextjs/` folder

### ⚠️ Images not loading
- Confirm images exist in `teacare-nextjs/public/assets/images/`
- Image paths in components must start with `/assets/images/...` (no `public/` prefix)
- External (Unsplash) images are allowed via `next.config.ts` `remotePatterns`

### ⚠️ Port 3000 already in use
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Then restart
npm run dev
```

---

## 🔁 9. Every-Session Startup Reminder

Every time you restart your computer, both servers must be restarted manually:

```bash
# Terminal 1 — Backend
cd teacare-backend && npm start

# Terminal 2 — Frontend
cd teacare-nextjs && npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 📞 10. Company Contact Details (How to update)

To update the address, phone, or email shown in the Contact section:

1. Open `teacare-nextjs/components/Contact.tsx`
2. Find the contact details array:
```tsx
{ icon: 'fa-map-location-dot', label: 'Office Address', val: '124, Lotus Road, Colombo 00100, Sri Lanka' },
{ icon: 'fa-phone-volume',     label: 'Direct Helpline', val: '+94 11 234 5678 / +94 77 123 4567' },
{ icon: 'fa-envelope-open-text', label: 'Email', val: 'info@teacareevents.com' },
```
3. Edit the `val` fields and save — changes appear on browser refresh.

---

*© 2026 Teacare Services Pvt Ltd. All rights reserved.*

---

## 🛠️ Recent Implementations & Maintenance (July 2026)

The following major updates and fixes were recently applied to the platform:

### Mobile View Optimization & Bug Fixes
- **Experience Section Layout:** Fixed a critical rendering issue where text blocks were appearing as massive empty spaces. Repositioned the "Why Choose Us" text strictly above the image grid for a natural mobile scrolling experience.
- **Hero Badge Scaling:** Fixed a bug causing the "Premier Corporate Event Specialists" badge to overlap with the headline. The badge was transitioned to a block container with specific mobile scaling (`0.48rem` font size, `0px` letter spacing, `nowrap`) to guarantee a sleek, single-line fit on narrow devices like the Lumia 550.
- **Hero Background Positioning:** Adjusted the mobile hero background focal point to `65%` to clearly display the food/event presentation elements on smaller screens.
- **Heading Order Adjustments:** Restored the "What We Offer" heading back to its logical position directly above the services grid, removing mobile duplication and visual confusion.

### Design Aesthetics & Animations
- **Advanced 3D Animations:** Upgraded the scroll-reveal engine. Elements now unfurl smoothly into place with a premium 3D `rotateX` transition. Removed an unreliable blur filter that was causing text to freeze on older mobile browsers.
- **Light-Gray Dark Theme Transition:** Softened the entire dark mode aesthetic. Replaced the extremely dark, pitch-black/blue backgrounds with an elegant, softer slate-gray scale (e.g., `#2c313a`, `#22272e`). This enhances readability while maintaining a highly premium corporate feel.
- **Continuous Background Drift:** Added a slow, subtle background pan to the main Hero section (`heroDrift`) to make the site feel alive without requiring user interaction.
- **Dynamic Button Shines:** Added a continuous, sweeping light-shine animation (`sweepingShine`) to all primary CTA buttons for higher user engagement.
- **Enhanced 3D Hover Physics:** Applied a deeper hover lift and a richer golden drop-shadow glow to service and statistic cards.
