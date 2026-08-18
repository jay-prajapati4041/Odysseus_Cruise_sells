<<<<<<< HEAD
# Odysseus_Cruise_sells
=======
# Odysseus Cruise Booking System

A full-stack cruise holiday booking platform for **Odysseus Cruises**, built with React + Tailwind CSS (frontend) and Express.js (backend).

Customers can browse available cruises, specify their travelling party (adults and children with ages), add optional services, receive a fully itemised price breakdown, and apply promotional codes — with clear rejection messages for invalid, expired, exhausted, or non-applicable codes.

---

## Project Structure

```
Technical/
├── BusinessRequirements.md   # Functional requirements and pricing rules
├── TechnicalApproach.md      # Architecture, design decisions and API reference
├── UnitTestCases.md          # Test case catalogue (mirrors the Jest tests)
├── README.md                 # This file
│
├── Backend/                  # Express REST API
│   ├── src/
│   │   ├── app.js            # Express setup (middleware, routes, error handlers)
│   │   ├── server.js         # HTTP listener on port 3001
│   │   ├── data/             # JSON seed data (cruises, promoCodes, bookings)
│   │   ├── pricing/
│   │   │   └── rules.js      # Section 5 pricing engine (pure function)
│   │   └── promo/
│   │       └── validator.js  # Promo code validator (pure function)
│   │   └── routes/
│   │       ├── cruises.js    # /api/cruises
│   │       └── bookings.js   # /api/bookings
│   └── tests/
│       ├── pricing.test.js   # Unit tests — pricing engine
│       └── promo.test.js     # Unit tests — promo validator
│
└── Frontend/                 # React + Vite + Tailwind CSS
    ├── src/
    │   ├── api/client.js     # Axios API wrapper
    │   ├── components/       # Reusable components (PriceBreakdown etc.)
    │   └── pages/            # CruisesPage, BookingPage, ConfirmationPage
    └── ...
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

### 1. Run the Backend

```bash
cd Backend
npm install
npm run dev        # starts on http://localhost:3001
```

#### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/cruises` | List available cruises |
| GET | `/api/cruises/:id` | Get cruise by ID |
| POST | `/api/bookings/price` | Get itemised price breakdown |
| POST | `/api/bookings/validate-promo` | Validate a promo code |
| POST | `/api/bookings` | Confirm a booking |
| GET | `/api/bookings/:id` | Get booking by reference |

---

### 2. Run the Frontend

```bash
cd Frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 3. Run Tests

```bash
cd Backend
npm test
```

Expected:
```
Test Suites: 2 passed, 2 total
Tests:       all passed
```

---

## Pricing Rules Summary

| Passenger | Condition | Price |
|---|---|---|
| Adult | Any age | `baseAdultPrice` |
| Infant | Age < 2 | **Free** |
| Child | Age 2–11 | `baseChildPrice` |
| Child 12+ | Age ≥ 12 | `baseAdultPrice` |

Optional services are charged **per person** (× total travellers) or **per booking** (flat fee). Promotional discounts apply to the subtotal after services.

---

## Promotional Code Rejection Reasons

| Reason | Meaning |
|---|---|
| `INVALID` | Code not found — customer should check for typos |
| `EXPIRED` | Code's expiry date has passed |
| `EXHAUSTED` | Code has been fully redeemed |
| `NOT_APPLICABLE` | Code is not valid for the selected cruise |

---

## Demo Promo Codes

| Code | Type | Value | Notes |
|---|---|---|---|
| `SAVE100` | Fixed | £100 off | Valid for any cruise |
| `SUMMER20` | Percent | 20% off | Mediterranean, Fjords, Caribbean cruises only |
| `GULF25` | Percent | 25% off | Arabian Gulf cruise only |
| `ARCTIC10` | Fixed | £10 off | Alaska cruise only |
| `EXPIRED50` | Percent | 50% off | **Expired** – for testing |
| `USED999` | Fixed | £999 off | **Exhausted** – for testing |
>>>>>>> c0ed385 (docs: add project requirements, technical approach and test documentation)
