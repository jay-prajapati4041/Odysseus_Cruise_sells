# Business Requirements – Odysseus Cruise Booking System

## 1. Overview

Odysseus is a cruise holiday company. This document defines the business requirements for the online cruise booking system, which enables customers to discover, configure, price, and confirm cruise bookings entirely online.

---

## 2. Scope

The system covers the end-to-end online booking journey for cruise holidays offered by Odysseus. It does not cover post-booking amendments, cancellations, or agent-assisted bookings in this initial release.

---

## 3. Stakeholders

| Stakeholder | Interest |
|---|---|
| Customer | Discover and book cruises online, see a fair and transparent price |
| Odysseus Commercial Team | Maximise revenue through dynamic pricing and promo effectiveness |
| Odysseus Operations Team | Receive accurate passenger manifests per cruise |
| Odysseus Marketing Team | Issue and control promotional codes |

---

## 4. Functional Requirements

### FR-1 · Cruise Discovery
A customer can find the cruises that are available to book.

- The system displays all cruises currently open for booking.
- For each cruise the customer can see: destination, ship name, departure port, departure and return dates, duration, and the starting adult price.
- Only cruises with remaining availability are shown.

### FR-2 · Traveller Specification
A customer can specify who is travelling and which optional services they want.

- The customer must specify the number of **adults** (minimum 1).
- The customer may add **children** and must provide the **age of each child** at the time of travel.
- The customer may select from a list of **optional services** offered for the chosen cruise (e.g. drinks packages, shore excursions, travel insurance, transfers).

### FR-3 · Pricing and Breakdown
The system prices the booking according to the rules in Section 5 and shows the customer a **breakdown**, not just a total.

- The breakdown must itemise:
  - Each adult (price per adult × number of adults)
  - Each child, showing their age, which pricing band applies, and the resulting price
  - Each selected optional service, showing the unit price, basis (per person or per booking), and line total
  - Any promotional discount (code, description, and amount saved)
  - Grand total
- Prices are shown in GBP (£).

### FR-4 · Promotional Codes
A customer may apply a **promotional code**. A code that is invalid, expired, exhausted, or not applicable to the booking must be **rejected with a clear reason**. The customer must be told **which** of those it was.

| Rejection Reason | Meaning | Customer Message |
|---|---|---|
| **INVALID** | Code does not exist in the system | The code entered does not exist; the customer should check for typos |
| **EXPIRED** | Code's expiry date has passed | The code expired on [date] and is no longer valid |
| **EXHAUSTED** | Code has reached its maximum number of uses | The code has been fully redeemed and is no longer available |
| **NOT_APPLICABLE** | Code is restricted to specific cruises and this is not one of them | The code is not applicable to this cruise |

---

## 5. Pricing Rules

> These rules govern how every booking is priced. They apply universally and are not negotiable without a business decision.

### 5.1 Passenger Pricing

All child prices are calculated as a **percentage of the adult base fare** for the selected cruise.

| Passenger Type | Age Range | % of Adult Fare | Notes |
|---|---|---|---|
| Adult | 18 and over | **100%** | Full `baseAdultPrice` |
| Child (Teen) | 12–17 | **75%** | Three-quarter adult fare |
| Child | 5–11 | **50%** | Half adult fare |
| Infant | 0–4 | **Free (0%)** | No charge |

**Example** — Adult fare £1,499:
| Passenger | Calculation | Price |
|---|---|---|
| Adult | £1,499 × 100% | £1,499.00 |
| Child age 14 | £1,499 × 75% | £1,124.25 |
| Child age 7 | £1,499 × 50% | £749.50 |
| Infant age 3 | £1,499 × 0% | £0.00 |

### 5.2 Optional Services Pricing

| Pricing Basis | Rule |
|---|---|
| **Per person** | Unit price × total number of travellers (adults + all children, including infants) |
| **Per booking** | Flat fee charged once regardless of party size |

### 5.3 Discount Application

- Promotional discounts are calculated on the **subtotal** (passengers + services combined).
- A **percent** discount reduces the subtotal by the stated percentage.
- A **fixed** discount reduces the subtotal by the stated amount; the grand total cannot go below £0.
- Only one promotional code may be applied per booking.

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Availability | 99.5% uptime during business hours |
| Response Time | Pricing calculation < 500 ms |
| Data Integrity | Promo `usedCount` must be incremented exactly once per confirmed booking |
| Security | No sensitive payment data stored; payment handled by third-party gateway (out of scope) |

---

## 7. Assumptions & Constraints

- Prices are quoted in GBP only for initial release.
- Only one promo code per booking is supported.
- Data is held in-memory (JSON) for the initial prototype; a persistent database will be introduced in a subsequent phase.
- Child ages at time of travel must be provided by the customer; the system does not verify them against identity documents at booking time.
