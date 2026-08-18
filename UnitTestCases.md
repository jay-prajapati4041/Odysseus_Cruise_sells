# Unit Test Cases – Odysseus Cruise Booking System

These test cases are implemented as Jest unit tests in `Backend/tests/`. Run with `npm test` from the `Backend/` directory.

---

## Module: Pricing Engine (`src/pricing/rules.js`)

### Test Suite: `calculatePrice()`

#### Adults

| # | Test Case | Input | Expected Output |
|---|---|---|---|
| P-01 | Single adult | `adults: 1, cruise-001` | `grandTotal = 1499` |
| P-02 | Two adults | `adults: 2, cruise-001` | `grandTotal = 2998` |
| P-03 | Adult line in breakdown | `adults: 3, cruise-001` | `passengers[0].lineTotal = 4497` |

#### Children – Age-Band Fare Rules (% of adult fare)

| # | Test Case | Input | Expected | Rule |
|---|---|---|---|---|
| P-04 | Age 0 → free | `children: [{age:0}]` | `unitPrice = 0`, `grandTotal = 1499` | 0–4 free |
| P-05 | Age 3 → free | `children: [{age:3}]` | `unitPrice = 0` | 0–4 free |
| P-06 | Age 4 → free (upper boundary) | `children: [{age:4}]` | `unitPrice = 0`, `grandTotal = 1499` | 0–4 free |
| P-07 | Age 5 → 50% (lower boundary) | `children: [{age:5}]` | `unitPrice = 749.50`, `grandTotal = 2248.50` | 5–11 = 50% |
| P-08 | Age 8 → 50% | `children: [{age:8}]` | `unitPrice = 749.50` | 5–11 = 50% |
| P-09 | Age 11 → 50% (upper boundary) | `children: [{age:11}]` | `unitPrice = 749.50`, `grandTotal = 2248.50` | 5–11 = 50% |
| P-10 | Age 12 → 75% (lower boundary) | `children: [{age:12}]` | `unitPrice = 1124.25`, `grandTotal = 2623.25` | 12–17 = 75% |
| P-11 | Age 15 → 75% | `children: [{age:15}]` | `unitPrice = 1124.25` | 12–17 = 75% |
| P-12 | Age 17 → 75% (upper boundary) | `children: [{age:17}]` | `unitPrice = 1124.25`, `grandTotal = 2623.25` | 12–17 = 75% |
| P-13 | Age 18 → full adult fare | `children: [{age:18}]` | `unitPrice = 1499`, `grandTotal = 2998` | 18+ = 100% |
| P-14 | Mixed: 2 adults + age4 + age7 + age14 | combined | `2×1499 + 0 + 749.50 + 1124.25` | All bands combined |

#### Optional Services

| # | Test Case | Input | Expected Output |
|---|---|---|---|
| P-11 | Per-person service | `svc-drinks` (£149), 2 adults + 1 child | `drinkLine.lineTotal = 149 × 3 = 447` |
| P-12 | Per-booking service | `svc-transfer` (£75), 4 adults | `transferLine.lineTotal = 75` (flat) |
| P-13 | Multiple services | `svc-drinks + svc-transfer`, 2 adults | `grandTotal = 2998 + 298 + 75 = 3371` |
| P-14 | Unknown service ID | `svc-nonexistent` | Silently ignored, `services = []` |

#### Promotional Discounts Applied

| # | Test Case | Promo | Expected Output |
|---|---|---|---|
| P-15 | Percent promo (20%) | `type:percent, value:20` on £2998 | `discount.amount = -599.60`, `grandTotal = 2398.40` |
| P-16 | Fixed promo (£100) | `type:fixed, value:100` on £1499 | `discount.amount = -100`, `grandTotal = 1399` |
| P-17 | Fixed promo > total | `type:fixed, value:999999` | `grandTotal = 0` (no negative totals) |
| P-18 | No promo applied | `promoCode: null` | `discount = null` |

#### Error Cases

| # | Test Case | Input | Expected Output |
|---|---|---|---|
| P-19 | Unknown cruise ID | `cruiseId: 'cruise-999'` | Throws `'Cruise not found'` error |
| P-20 | Cruise info in breakdown | Any valid cruise | `breakdown.cruise.name` correctly populated |

---

## Module: Promo Code Validator (`src/promo/validator.js`)

### Test Suite: `validatePromoCode()`

#### INVALID – Code Does Not Exist

| # | Test Case | Input | Expected |
|---|---|---|---|
| V-01 | Unknown code | `'TOTALLYWRONG'` | `valid: false, reason: 'INVALID'` |
| V-02 | INVALID customer message | `'BADCODE'` | message matches `/does not exist/i` |
| V-03 | Empty string | `''` | `valid: false, reason: 'INVALID'` |
| V-04 | Null input | `null` | `valid: false, reason: 'INVALID'` |
| V-05 | Case-insensitive lookup | `'save100'` | `valid: true` (SAVE100 found) |

#### EXPIRED – Past Expiry Date

| # | Test Case | Input | Expected |
|---|---|---|---|
| V-06 | Expired code `EXPIRED50` | `'EXPIRED50'` | `valid: false, reason: 'EXPIRED'` |
| V-07 | Message includes expiry date | `'EXPIRED50'` | message contains `'2025'` |
| V-08 | No promoDoc returned | `'EXPIRED50'` | `promoDoc: null` |

#### EXHAUSTED – Max Uses Reached

| # | Test Case | Input | Expected |
|---|---|---|---|
| V-09 | Exhausted code `USED999` | `'USED999'` | `valid: false, reason: 'EXHAUSTED'` |
| V-10 | Message indicates exhausted | `'USED999'` | message matches `/redeemed\|exhausted\|no longer available/i` |
| V-11 | No promoDoc returned | `'USED999'` | `promoDoc: null` |

#### NOT_APPLICABLE – Wrong Cruise

| # | Test Case | Input | Expected |
|---|---|---|---|
| V-12 | GULF25 on wrong cruise | `'GULF25', 'cruise-001'` | `valid: false, reason: 'NOT_APPLICABLE'` |
| V-13 | Message says not applicable | `'GULF25', 'cruise-001'` | message matches `/not applicable/i` |
| V-14 | GULF25 on correct cruise | `'GULF25', 'cruise-005'` | `valid: true` |
| V-15 | ARCTIC10 on wrong cruise | `'ARCTIC10', 'cruise-003'` | `valid: false, reason: 'NOT_APPLICABLE'` |

#### Valid Codes – All Checks Pass

| # | Test Case | Input | Expected |
|---|---|---|---|
| V-16 | SAVE100 (universal) | `'SAVE100', 'cruise-001'` | `valid: true, reason: null` |
| V-17 | SAVE100 returns correct promoDoc | `'SAVE100', 'cruise-003'` | `type: 'fixed', value: 100` |
| V-18 | SUMMER20 for applicable cruise | `'SUMMER20', 'cruise-001'` | `valid: true, type: 'percent', value: 20` |
| V-19 | SUMMER20 for non-applicable cruise | `'SUMMER20', 'cruise-004'` | `valid: false, reason: 'NOT_APPLICABLE'` |

---

## Test Execution

```bash
cd Backend
npm install
npm test
```

Expected output:
```
Test Suites: 2 passed, 2 total
Tests:       XX passed, XX total
```
