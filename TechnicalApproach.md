# Technical Approach – Odysseus Cruise Booking System

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                    Browser (Customer)                       │
│              React + Vite + Tailwind CSS                    │
│   CruisesPage → BookingPage (multi-step) → ConfirmPage     │
└───────────────────────────┬────────────────────────────────┘
                            │ HTTP/REST (JSON)
                            │
┌───────────────────────────▼────────────────────────────────┐
│               Express REST API (Node.js)                    │
│   /api/cruises        – cruise catalogue                    │
│   /api/bookings/price – pricing engine                      │
│   /api/bookings/validate-promo – promo validation           │
│   /api/bookings       – booking creation & retrieval        │
└───────────────────────────┬────────────────────────────────┘
                            │ require() (in-process)
                            │
┌───────────────────────────▼────────────────────────────────┐
│           In-Memory JSON Data Store (prototype)             │
│   cruises.json │ promoCodes.json │ bookings.json            │
└────────────────────────────────────────────────────────────┘
```

The system follows a clean **separation of concerns**:
- **Data layer** — JSON seed files acting as an in-memory store
- **Business logic layer** — pricing engine and promo validator (pure functions, easily unit-testable)
- **API layer** — Express route handlers for input validation and HTTP semantics
- **Presentation layer** — React components for UI rendering

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 18, Vite | Fast HMR, modern React tooling |
| Styling | Tailwind CSS | Utility-first, rapid development |
| HTTP Client | Axios | Promise-based, interceptors for error handling |
| Backend | Node.js + Express 4 | Lightweight, universal JS |
| Testing | Jest + Supertest | Industry-standard, great assertion API |
| Dev tooling | Nodemon | Auto-restart on file change |
| IDs | uuid v4 | Unique booking references |
| Data store | JSON files (in-memory) | Sufficient for prototype; swap to DB in phase 2 |

---

## 3. Backend Design

### 3.1 Directory Structure

```
Backend/
├── src/
│   ├── app.js              # Express app (middleware, routes, error handlers)
│   ├── server.js           # HTTP listener entry point
│   ├── data/
│   │   ├── cruises.json    # 5 cruise records with services
│   │   ├── promoCodes.json # Promo codes (valid, expired, exhausted, cruise-specific)
│   │   └── bookings.json   # Booking store (seeded with 1 example)
│   ├── pricing/
│   │   └── rules.js        # Section 5 pricing engine (pure function)
│   ├── promo/
│   │   └── validator.js    # Promo code validator (pure function)
│   └── routes/
│       ├── cruises.js      # GET /api/cruises, GET /api/cruises/:id
│       └── bookings.js     # POST /price, POST /validate-promo, POST /, GET /:id
└── tests/
    ├── pricing.test.js     # ~16 unit tests for pricing engine
    └── promo.test.js       # ~14 unit tests for promo validator
```

### 3.2 Pricing Engine (`src/pricing/rules.js`)

The engine is a **pure function** `calculatePrice({ cruiseId, adults, children, serviceIds, promoCode })` that:

1. Looks up cruise base prices from `cruises.json`
2. Applies passenger pricing by age band (Section 5.1)
3. Calculates per-person and per-booking service fees (Section 5.2)
4. Applies promotional discount on the post-services subtotal (Section 5.3)
5. Returns a full **itemised breakdown** object — never just a total

Being a pure function makes it trivially simple to unit-test without any HTTP overhead.

### 3.3 Promo Validator (`src/promo/validator.js`)

The validator is a **pure function** `validatePromoCode(code, cruiseId)` that checks, in strict order:

1. **INVALID** — code not found in `promoCodes.json`
2. **EXPIRED** — `expiresAt` date is in the past
3. **EXHAUSTED** — `usedCount >= maxUses`
4. **NOT_APPLICABLE** — `applicableCruiseIds` is not null and does not include the cruise

Each check returns a distinct `reason` string and a human-readable `message` for the UI. The order matters: a code that is both expired and exhausted reports EXPIRED (checked first).

### 3.4 API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/cruises` | List all available cruises |
| GET | `/api/cruises/:id` | Get single cruise details |
| POST | `/api/bookings/price` | Calculate price breakdown (no booking created) |
| POST | `/api/bookings/validate-promo` | Validate a promo code alone |
| POST | `/api/bookings` | Create and confirm a booking |
| GET | `/api/bookings/:id` | Retrieve a booking by reference ID |

### 3.5 Error Handling

- `400` — missing or invalid request body fields
- `404` — cruise or booking not found
- `422` — promo code rejected (with structured `promoError.reason` + `promoError.message`)
- `500` — unexpected server error (global Express error handler)

---

## 4. Frontend Design

### 4.1 Directory Structure

```
Frontend/
├── src/
│   ├── api/
│   │   └── client.js           # Axios instance + API helper functions
│   ├── components/
│   │   └── PriceBreakdown.jsx  # Itemised price display component
│   ├── pages/
│   │   ├── CruisesPage.jsx     # Cruise listing
│   │   ├── BookingPage.jsx     # Multi-step booking form
│   │   └── ConfirmationPage.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
└── vite.config.js
```

### 4.2 Booking Flow (Multi-Step Form)

```
Step 1: Travellers
  └── # adults (spinner), # children → age input per child

Step 2: Optional Services
  └── Checkboxes for each service; calls POST /price on change

Step 3: Promo Code
  └── Text input → POST /validate-promo
  └── Inline rejection message (INVALID / EXPIRED / EXHAUSTED / NOT_APPLICABLE)

Step 4: Summary & Confirm
  └── Full PriceBreakdown component
  └── Lead passenger details (name, email)
  └── "Confirm Booking" → POST /bookings → ConfirmationPage
```

---

## 5. Testing Strategy

| Test Type | Tool | Coverage |
|---|---|---|
| Unit – Pricing Engine | Jest | Adult, child age bands, services, promos, edge cases |
| Unit – Promo Validator | Jest | All 4 rejection reasons, case-insensitivity, valid codes |
| Manual – Frontend | Browser | Full booking flow end-to-end |

**Command:** `cd Backend && npm test`

---

## 6. Future Considerations (Phase 2)

- Replace JSON data store with PostgreSQL or MongoDB
- Add JWT-based customer authentication
- Integrate Stripe or similar for payment processing
- Add email confirmation on booking
- Add admin dashboard for managing cruises and promo codes
