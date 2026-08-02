# Vitafoam Storefront — Implementation Plan

## Recap & Vision

You have a fully-featured NestJS backend (`vitaForm`) and an Admin Dashboard (`adminPortal`). The final missing piece is the **customer-facing storefront** (`storeFront`) — the e-commerce web app that real users will shop on.

The backend exposes the following **customer-facing capabilities** (all confirmed from controllers):

| Feature Group | Capabilities |
|---|---|
| **Auth** | Register, Login (session-based), OTP verify (email/phone), Forgot/Reset password, Multi-device session management |
| **Catalog** | Browse products (paginated, filtered, sorted), Product detail by slug, Related products, Category browsing |
| **Search** | Full-text product search |
| **Cart** | Guest cart (no login needed via `X-Guest-Session-ID` header), Add / Update / Remove / Clear, Apply/Remove coupon, Merge guest cart on login |
| **Checkout** | Calculate fees preview, Validate delivery address, Initiate checkout (with SKU locking) |
| **Payments** | Payment gateway initiation (Paystack / Flutterwave / Moniepoint / OPay) |
| **Orders** | Order history, Order detail, Order tracking timeline, Cancel order |
| **Wishlist** | Add/Remove products, Move to cart |
| **Reviews** | View product reviews (public), Submit review (auth), Mark helpful, View my reviews |
| **Notifications** | In-app notifications list, Unread count, Mark read/all-read, Delete |
| **Warranty** | Register warranty for purchased product, File warranty claims, View my warranties |
| **Sleep Quiz** | Interactive AI sleep quiz → mattress recommendation |
| **Mattress Finder** | AI-powered mattress finder wizard |
| **Recommendations** | Personalized (logged-in), Popular (public), Trending (public) |
| **Articles (Blog)** | Public blog list (by tag), Article detail page |
| **Support Chat** | Open a support ticket, View ticket messages |
| **Dealers** | Find nearby dealers by geo-coordinates |
| **Promotions** | View active promotions, Apply coupon codes |
| **User Profile** | View/update profile, Address book CRUD, Preferences (push/newsletter/SMS), Device registration |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Custom Properties (design tokens)
- **State**: Zustand (lightweight, persistent slices for auth + cart)
- **HTTP**: Axios with custom interceptors (mirrors adminPortal pattern)
- **Fonts**: Google Fonts — `Inter` (body) + `Playfair Display` (headings/branding)
- **Icons**: Lucide React
- **Toasts**: Custom toast component (no heavy libs)

---

## Project Structure

```
storeFront/
├── public/
│   └── images/              # Static brand assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (public)/        # Publicly accessible pages (layout with header/footer)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product listing
│   │   │   │   └── [slug]/page.tsx   # Product detail
│   │   │   ├── categories/[slug]/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── deals/page.tsx        # Active promotions
│   │   │   ├── sleep-quiz/page.tsx
│   │   │   ├── mattress-finder/page.tsx
│   │   │   ├── dealers/page.tsx
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── layout.tsx            # Header + Footer wrapper
│   │   ├── (auth)/          # Auth pages (no header/footer, centered layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── verify-otp/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (account)/       # Protected account pages (sidebar layout)
│   │   │   ├── account/page.tsx      # Profile overview
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx     # Order detail + tracking
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── warranty/
│   │   │   │   ├── page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── addresses/page.tsx
│   │   │   ├── preferences/page.tsx
│   │   │   └── support/page.tsx      # Support chat tickets
│   │   ├── cart/page.tsx             # Cart (public, guest-friendly)
│   │   ├── checkout/page.tsx         # Checkout (requires auth)
│   │   └── layout.tsx                # Root layout (fonts, providers)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Nav, cart count badge, search bar
│   │   │   ├── Footer.tsx
│   │   │   └── AccountSidebar.tsx
│   │   ├── ui/                      # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── StarRating.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductImages.tsx    # Image gallery with zoom
│   │   │   ├── ProductVariants.tsx  # Size/color variant selector
│   │   │   └── ReviewSection.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx       # Slide-in cart preview
│   │   │   ├── CartItem.tsx
│   │   │   └── CouponInput.tsx
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedCategories.tsx
│   │   │   ├── TrendingProducts.tsx
│   │   │   └── PromoStrip.tsx
│   │   └── account/
│   │       ├── OrderCard.tsx
│   │       ├── OrderTracking.tsx
│   │       └── NotificationItem.tsx
│   ├── lib/
│   │   ├── api.ts              # All API calls (mirrors adminPortal pattern)
│   │   ├── auth.ts             # Auth helpers (token storage, session)
│   │   └── utils.ts
│   ├── store/
│   │   ├── auth.store.ts       # Zustand auth slice (user, token, isLoggedIn)
│   │   └── cart.store.ts       # Zustand cart slice (items, count, guestId)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useNotifications.ts
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces
│   └── middleware.ts           # Next.js middleware for route protection
├── next.config.ts              # Rewrites → backend API URL
├── .env.local
└── tsconfig.json
```

---

## Design System

| Token | Value |
|---|---|
| Primary | `#1a5c38` (Vitafoam deep green) |
| Primary Light | `#2d8f5c` |
| Accent | `#f5a623` (warm gold) |
| Background | `#fafaf8` (warm off-white) |
| Surface | `#ffffff` |
| Text Primary | `#1a1a1a` |
| Text Secondary | `#555555` |
| Border | `#e5e5e5` |
| Success | `#22c55e` |
| Error | `#ef4444` |

**Heading Font**: Playfair Display (elegant, premium mattress brand feel)
**Body Font**: Inter (clean, readable)

---

## Auth Strategy

- Session token stored in `localStorage` as `vita_token`
- Axios interceptor attaches `Authorization: Bearer <token>` to all requests
- Guest cart uses UUID stored in `localStorage` as `vita_guest_id`
- On login, cart merge API is called automatically (`POST /cart/merge`)
- Next.js `middleware.ts` protects `/account/*` and `/checkout` routes
- If token expires/401 → clear token → redirect to `/login`

---

## Mobile Responsiveness Strategy

Mobile-first is a **core requirement** — not an afterthought. Every component is designed at 375px and scaled up.

| Breakpoint | Label | Target Devices |
|---|---|---|
| `< 640px` | `sm` | Phones (iPhone SE → Pixel) |
| `640–1023px` | `md` | Tablets / Large phones |
| `1024–1279px` | `lg` | Small laptops |
| `≥ 1280px` | `xl` | Desktop / Wide screens |

### Key Mobile Patterns
- **Header**: Logo + hamburger menu (slide-in drawer nav) on mobile; full nav on desktop
- **Product Grid**: 2 columns on mobile, 3 on tablet, 4 on desktop
- **Cart**: Full-screen page on mobile; slide-in drawer on desktop
- **Checkout**: Single-column stacked form on mobile; 2-column (form + summary) on desktop
- **Account Sidebar**: Bottom tab bar on mobile; left sidebar on desktop
- **Sleep Quiz**: Full-screen step wizard (one question per screen) on mobile
- **Product Detail**: Image first → info below on mobile; side-by-side on desktop
- **Filters**: Bottom sheet modal on mobile; left sidebar on desktop

---

## Batched Implementation Groups

### 🟢 Batch 1 — Project Scaffold + Design System
> *Foundation everything else builds on*

- `[NEW]` Initialize Next.js 15 project in `storeFront/`
- `[NEW]` `next.config.ts` — API rewrites to Render backend
- `[NEW]` `.env.local` — environment variables
- `[NEW]` `src/app/globals.css` — full CSS design system (tokens, typography, utilities, responsive grid)
- `[NEW]` `src/types/index.ts` — all shared TypeScript interfaces
- `[NEW]` `src/lib/api.ts` — Axios client with session interceptors + all endpoint bindings
- `[NEW]` `src/lib/utils.ts` — helpers (formatPrice, formatDate, truncate, etc.)
- `[NEW]` `src/store/auth.store.ts` — Zustand auth slice
- `[NEW]` `src/store/cart.store.ts` — Zustand cart slice (guest-aware)
- `[NEW]` `src/middleware.ts` — route protection for `/account/*` and `/checkout`
- `[NEW]` `src/components/ui/` — Button, Card, Badge, Input, Modal, Toast, Spinner, StarRating
- `[NEW]` `src/app/layout.tsx` — Root layout (fonts, providers, Toast container)

---

### 🟢 Batch 2 — Layout Shell (Header, Footer, Navigation)
> *Shared chrome visible on every page*

- `[NEW]` `src/components/layout/Header.tsx`
  - **Mobile**: Logo + hamburger → full-screen slide-in drawer menu
  - **Desktop**: Logo | Category nav | Search bar | Wishlist icon | Cart icon (with count) | Account icon
  - Sticky on scroll with blur backdrop
  - Notification bell with unread count (for logged-in users)
- `[NEW]` `src/components/layout/MobileDrawer.tsx` — slide-in nav for mobile
- `[NEW]` `src/components/layout/Footer.tsx`
  - 4-column grid on desktop, stacked on mobile
  - Links: Shop, Company, Support, Social
- `[NEW]` `src/app/(public)/layout.tsx` — wraps Header + Footer
- `[NEW]` `src/app/(auth)/layout.tsx` — centered card layout (no header/footer)
- `[NEW]` `src/app/(account)/layout.tsx` — Account layout
  - **Mobile**: Top bar + bottom tab navigation (5 tabs)
  - **Desktop**: Left sidebar + content area

---

### 🟢 Batch 3 — Homepage
> *First impression — must WOW*

- `[NEW]` `src/components/home/HeroBanner.tsx`
  - Full-viewport hero with brand imagery + CTA
  - Auto-sliding carousel (from `/admin/banners` API)
  - **Mobile**: Full-screen with overlay text + CTA button
- `[NEW]` `src/components/home/FeaturedCategories.tsx`
  - Horizontally scrollable on mobile, grid on desktop
- `[NEW]` `src/components/home/TrendingProducts.tsx`
  - Horizontal scroll carousel on mobile, grid on desktop
- `[NEW]` `src/components/home/PromoStrip.tsx` — active deals banner
- `[NEW]` `src/components/home/AIRecommendations.tsx` — "You might like" section
- `[NEW]` `src/components/home/BlogPreview.tsx` — latest 3 articles
- `[NEW]` `src/app/(public)/page.tsx` — assembles all home sections

---

### 🟢 Batch 4 — Product Catalog + Search
> *Core shopping browsing experience*

- `[NEW]` `src/components/product/ProductCard.tsx`
  - Image, name, price, rating, wishlist heart toggle
  - **Mobile**: Compact 2-per-row card
  - **Desktop**: Richer card with hover "Add to Cart" overlay
- `[NEW]` `src/components/product/ProductGrid.tsx` — responsive grid wrapper
- `[NEW]` `src/components/product/ProductFilters.tsx`
  - **Mobile**: "Filters" button → bottom sheet modal
  - **Desktop**: Left sidebar with sticky positioning
- `[NEW]` `src/app/(public)/products/page.tsx` — Product listing with URL-state filters
- `[NEW]` `src/app/(public)/categories/[slug]/page.tsx` — Category-scoped listing
- `[NEW]` `src/app/(public)/search/page.tsx` — Search results with debounced input

---

### 🟢 Batch 5 — Product Detail Page
> *The most complex single page*

- `[NEW]` `src/components/product/ProductImages.tsx`
  - **Mobile**: Swipeable full-width image carousel
  - **Desktop**: Main image + thumbnail strip with zoom on hover
- `[NEW]` `src/components/product/ProductVariants.tsx` — size/firmness/color picker
- `[NEW]` `src/components/product/ReviewSection.tsx` — review list + submit form
- `[NEW]` `src/app/(public)/products/[slug]/page.tsx`
  - **Mobile**: Image → Info → Add to Cart sticky bottom bar → Tabs → Related
  - **Desktop**: 2-column (images | info) → Tabs below → Related grid
  - Sticky "Add to Cart" bar on mobile (fixed bottom)

---

### 🟢 Batch 6 — Cart
> *Guest-friendly, works without login*

- `[NEW]` `src/components/cart/CartItem.tsx` — item row with qty controls
- `[NEW]` `src/components/cart/CouponInput.tsx` — coupon apply/remove
- `[NEW]` `src/components/cart/CartDrawer.tsx`
  - **Desktop only**: slide-in from right when cart icon clicked
- `[NEW]` `src/app/cart/page.tsx`
  - **Mobile**: Full-screen cart page (no drawer)
  - **Desktop**: Also available as page (linked from drawer)
  - Guest UUID generated + stored in localStorage
  - Shows coupon input, order summary, proceed button

---

### 🟢 Batch 7 — Auth Flow
> *Registration, login, OTP verification*

- `[NEW]` `src/app/(auth)/login/page.tsx`
  - Email/phone + password form
  - "Remember me" checkbox
  - Link to register + forgot password
- `[NEW]` `src/app/(auth)/register/page.tsx`
  - Name, email, phone, password fields
  - On success → redirect to OTP verify
- `[NEW]` `src/app/(auth)/verify-otp/page.tsx`
  - 6-box OTP input (auto-focus next box)
  - Resend OTP countdown timer
- `[NEW]` `src/app/(auth)/forgot-password/page.tsx`
- `[NEW]` `src/app/(auth)/reset-password/page.tsx`
- **On login**: merge guest cart automatically
- All auth pages: full-screen centered on mobile, card on desktop

---

### 🟢 Batch 8 — Account: Profile + Addresses + Preferences
> *Core account management*

- `[NEW]` `src/app/(account)/account/page.tsx` — Profile view/edit (name, avatar, phone)
- `[NEW]` `src/app/(account)/addresses/page.tsx`
  - Address cards with edit/delete
  - Add new address form (sheet/modal)
  - Set as default button
- `[NEW]` `src/app/(account)/preferences/page.tsx`
  - Toggle switches for push, newsletter, SMS
  - **Mobile**: Full-width toggle rows

---

### 🟢 Batch 9 — Account: Orders + Wishlist + Notifications
> *Post-purchase experience*

- `[NEW]` `src/app/(account)/orders/page.tsx` — paginated order history list
- `[NEW]` `src/app/(account)/orders/[id]/page.tsx`
  - Order detail + visual tracking stepper
  - **Mobile**: Vertical stepper (full width)
  - **Desktop**: Horizontal timeline
  - Cancel order button (if eligible)
- `[NEW]` `src/app/(account)/wishlist/page.tsx` — saved items grid with "Move to Cart"
- `[NEW]` `src/app/(account)/notifications/page.tsx`
  - Notification feed with unread badge on tab
  - Mark all read button
  - **Mobile**: Full list (no sidebar, bottom tabs)

---

### 🟢 Batch 10 — Checkout + Payment
> *Revenue-critical flow*

- `[NEW]` `src/app/checkout/page.tsx`
  - Step 1: Select/add delivery address
  - Step 2: Review order + fee calculation preview
  - Step 3: Select payment method → redirect to gateway
  - **Mobile**: One step per screen with back/next buttons
  - **Desktop**: Single page 2-column (form | order summary)
  - Requires auth — middleware redirects to login if not

---

### 🟢 Batch 11 — Speciality Features
> *AI tools and brand differentiators*

- `[NEW]` `src/app/(public)/sleep-quiz/page.tsx`
  - Animated step-by-step wizard
  - **Mobile**: Full-screen per question, swipe-friendly
  - Polls for AI result → shows recommended products
- `[NEW]` `src/app/(public)/deals/page.tsx` — active promotions + coupon codes display
- `[NEW]` `src/app/(public)/articles/page.tsx` — blog list with tag filter
- `[NEW]` `src/app/(public)/articles/[slug]/page.tsx` — full article
- `[NEW]` `src/app/(public)/dealers/page.tsx` — dealer list with geo-filter

---

### 🟢 Batch 12 — Warranty + Support Chat
> *Post-sale trust features*

- `[NEW]` `src/app/(account)/warranty/page.tsx` — my warranties list
- `[NEW]` `src/app/(account)/warranty/register/page.tsx` — register warranty form
- `[NEW]` `src/app/(account)/support/page.tsx`
  - Ticket list with status (Open / Assigned / Closed)
  - View ticket messages thread
  - Open new ticket button
  - **Mobile**: Full-screen chat-style UI
  - **Desktop**: Split pane (ticket list | messages)

---

## Delivery Order Summary

```
Batch 1  → Project Scaffold + Design System
Batch 2  → Layout Shell (Header, Footer, Navs)
Batch 3  → Homepage
Batch 4  → Product Catalog + Search
Batch 5  → Product Detail Page
Batch 6  → Cart (Guest-friendly)
Batch 7  → Auth Flow
Batch 8  → Account: Profile + Addresses + Preferences
Batch 9  → Account: Orders + Wishlist + Notifications
Batch 10 → Checkout + Payment
Batch 11 → Speciality (Sleep Quiz, Deals, Blog)
Batch 12 → Warranty + Support Chat
```

> [!TIP]
> Each batch is independently deployable. After Batch 6, users can already browse, search, add to cart and shop as guests — a fully working MVP.

---

## Verification Plan

1. **TypeScript**: `npx tsc --noEmit` after each phase
2. **API Integration**: Test each page against the live Render API
3. **Guest Cart**: Verify guest → login → cart merge flow end-to-end
4. **Auth Guard**: Verify middleware redirects to `/login` for protected routes
5. **Responsive**: Test on mobile (360px) and desktop (1440px) viewports
