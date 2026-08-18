'use strict';

const { calculatePrice } = require('../src/pricing/rules');
const cruises = require('../src/data/cruises.json');

// cruise-001: baseAdultPrice = 1499
const ADULT = 1499;
const CHILD_5_11 = Math.round(ADULT * 0.5 * 100) / 100;   // 749.50
const CHILD_12_17 = Math.round(ADULT * 0.75 * 100) / 100; // 1124.25

describe('Pricing Engine – calculatePrice()', () => {

    // ── Adults ────────────────────────────────────────────────────────────────
    describe('Adults', () => {
        test('1 adult → full base fare', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [], serviceIds: [] });
            expect(result.grandTotal).toBe(ADULT);
        });

        test('2 adults → 2 × baseAdultPrice', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 2, children: [], serviceIds: [] });
            expect(result.grandTotal).toBe(ADULT * 2);
        });

        test('Adult passenger line appears in breakdown', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 3, children: [], serviceIds: [] });
            const adultLine = result.passengers.find((p) => p.type === 'Adults');
            expect(adultLine.lineTotal).toBe(ADULT * 3);
        });
    });

    // ── Children – Age Bands (% of adult fare) ────────────────────────────────
    describe('Children – age-band fare rules', () => {

        // ── 0–4 FREE ──────────────────────────────────────────────────────────
        test('Age 0 → FREE', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 0 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 0'));
            expect(line.unitPrice).toBe(0);
            expect(line.lineTotal).toBe(0);
            expect(result.grandTotal).toBe(ADULT);
        });

        test('Age 3 → FREE', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 3 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 3'));
            expect(line.unitPrice).toBe(0);
            expect(result.grandTotal).toBe(ADULT);
        });

        test('Age 4 → FREE (boundary upper)', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 4 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 4'));
            expect(line.unitPrice).toBe(0);
            expect(result.grandTotal).toBe(ADULT);
        });

        // ── 5–11 → 50% of adult fare ──────────────────────────────────────────
        test('Age 5 → 50% of adult fare (boundary lower)', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 5 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 5'));
            expect(line.unitPrice).toBe(CHILD_5_11);
            expect(result.grandTotal).toBe(ADULT + CHILD_5_11);
        });

        test('Age 8 → 50% of adult fare', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 8 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 8'));
            expect(line.unitPrice).toBe(CHILD_5_11);
        });

        test('Age 11 → 50% of adult fare (boundary upper)', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 11 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 11'));
            expect(line.unitPrice).toBe(CHILD_5_11);
            expect(result.grandTotal).toBe(ADULT + CHILD_5_11);
        });

        // ── 12–17 → 75% of adult fare ─────────────────────────────────────────
        test('Age 12 → 75% of adult fare (boundary lower)', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 12 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 12'));
            expect(line.unitPrice).toBe(CHILD_12_17);
            expect(result.grandTotal).toBe(ADULT + CHILD_12_17);
        });

        test('Age 15 → 75% of adult fare', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 15 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 15'));
            expect(line.unitPrice).toBe(CHILD_12_17);
        });

        test('Age 17 → 75% of adult fare (boundary upper)', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 17 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 17'));
            expect(line.unitPrice).toBe(CHILD_12_17);
            expect(result.grandTotal).toBe(ADULT + CHILD_12_17);
        });

        // ── 18+ → full adult fare ─────────────────────────────────────────────
        test('Age 18 → full adult fare (boundary)', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [{ age: 18 }], serviceIds: [] });
            const line = result.passengers.find((p) => p.type.includes('Age 18'));
            expect(line.unitPrice).toBe(ADULT);
            expect(result.grandTotal).toBe(ADULT + ADULT);
        });

        // ── Mixed party ───────────────────────────────────────────────────────
        test('Mixed party: 2 adults + age4(free) + age7(50%) + age14(75%)', () => {
            const result = calculatePrice({
                cruiseId: 'cruise-001',
                adults: 2,
                children: [{ age: 4 }, { age: 7 }, { age: 14 }],
                serviceIds: [],
            });
            const expectedPaxTotal = ADULT * 2 + 0 + CHILD_5_11 + CHILD_12_17; // 4871.75
            const expectedDiscount = Math.round(expectedPaxTotal * 0.10 * 100) / 100; // 487.18
            expect(result.grandTotal).toBeCloseTo(expectedPaxTotal - expectedDiscount, 2);
        });
    });

    // ── Optional Services ──────────────────────────────────────────────────────
    describe('Optional Services', () => {
        test('per_person service × total travellers (adult + children)', () => {
            // 2 adults + 1 child = 3 travellers, insurance £80×3 = £240
            const result = calculatePrice({
                cruiseId: 'cruise-001',
                adults: 2,
                children: [{ age: 7 }],
                serviceIds: ['svc-insurance'],
            });
            const insuranceLine = result.services.find((s) => s.id === 'svc-insurance');
            expect(insuranceLine.lineTotal).toBe(80 * 3);
        });

        test('per_person_per_night service × travellers × nights', () => {
            // cruise-001 is 14 nights. 5 travellers. wifi £15×5×14 = £1050
            const result = calculatePrice({
                cruiseId: 'cruise-001',
                adults: 5,
                children: [],
                serviceIds: ['svc-wifi'],
            });
            const wifiLine = result.services.find((s) => s.id === 'svc-wifi');
            expect(wifiLine.lineTotal).toBe(15 * 5 * 14);
        });

        test('Multiple services combined correctly', () => {
            // 2 adults: insurance(80×2=160) + wifi(15×2×14=420) = 580.
            // pax total = 1499 * 2 = 2998.
            // No group discount. Total = 2998 + 580 = 3578
            const result = calculatePrice({
                cruiseId: 'cruise-001',
                adults: 2,
                children: [],
                serviceIds: ['svc-insurance', 'svc-wifi'],
            });
            expect(result.grandTotal).toBe(ADULT * 2 + 160 + 420);
        });

        test('Unknown service ID silently ignored', () => {
            const result = calculatePrice({
                cruiseId: 'cruise-001',
                adults: 1,
                children: [],
                serviceIds: ['svc-nonexistent'],
            });
            expect(result.services).toHaveLength(0);
            expect(result.grandTotal).toBe(ADULT);
        });
    });

    // ── Promo Codes ────────────────────────────────────────────────────────────
    describe('Promo Code – applied to subtotal', () => {
        const percentPromo = { code: 'SUMMER20', type: 'percent', value: 20 };
        const fixedPromo = { code: 'SAVE100', type: 'fixed', value: 100 };

        test('20% promo on 2 adults (2998)', () => {
            const result = calculatePrice({
                cruiseId: 'cruise-001', adults: 2, children: [], serviceIds: [], promoCode: percentPromo,
            });
            expect(result.discount.amount).toBeCloseTo(-(ADULT * 2 * 0.2), 2);
            expect(result.grandTotal).toBeCloseTo(ADULT * 2 * 0.8, 2);
        });

        test('Fixed £100 promo on 1 adult', () => {
            const result = calculatePrice({
                cruiseId: 'cruise-001', adults: 1, children: [], serviceIds: [], promoCode: fixedPromo,
            });
            expect(result.discount.amount).toBe(-100);
            expect(result.grandTotal).toBe(ADULT - 100);
        });

        test('Fixed promo larger than total → grandTotal is 0', () => {
            const bigPromo = { code: 'TEST', type: 'fixed', value: 999999 };
            const result = calculatePrice({
                cruiseId: 'cruise-001', adults: 1, children: [], serviceIds: [], promoCode: bigPromo,
            });
            expect(result.grandTotal).toBe(0);
        });

        test('No promo → discount is null', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [], serviceIds: [] });
            expect(result.discount).toBeNull();
        });
    });

    // ── Group Discount ─────────────────────────────────────────────────────────
    describe('Group Discount – based on total passengers', () => {
        test('1-2 passengers → no group discount', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 2, children: [], serviceIds: [] });
            expect(result.groupDiscount).toBeNull();
            expect(result.subtotal).toBe(ADULT * 2);
        });

        test('3-4 passengers → 5% group discount on passenger total', () => {
            // 3 adults -> 3 * 1499 = 4497. 5% discount = 224.85
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 3, children: [], serviceIds: [] });
            expect(result.groupDiscount.pct).toBe(5);
            expect(result.groupDiscount.amount).toBeCloseTo(-(ADULT * 3 * 0.05), 2);
            expect(result.subtotal).toBe(ADULT * 3);
            expect(result.grandTotal).toBeCloseTo(ADULT * 3 * 0.95, 2);
        });

        test('5-6 passengers → 10% group discount on passenger total', () => {
            // 4 adults, 1 child (age 14 -> 75%) = 5 travellers
            // passenger total = 4 * 1499 + 1124.25 = 7120.25
            // discount = 712.03
            const result = calculatePrice({
                cruiseId: 'cruise-001',
                adults: 4,
                children: [{ age: 14 }],
                serviceIds: []
            });
            expect(result.groupDiscount.pct).toBe(10);
            expect(result.groupDiscount.amount).toBeCloseTo(-((ADULT * 4 + CHILD_12_17) * 0.10), 2);
        });
    });

    // ── Error Cases ────────────────────────────────────────────────────────────
    describe('Error Cases', () => {
        test('Unknown cruiseId throws', () => {
            expect(() => calculatePrice({ cruiseId: 'cruise-999', adults: 1, children: [], serviceIds: [] }))
                .toThrow('Cruise not found');
        });

        test('Cruise name and duration appear in breakdown', () => {
            const result = calculatePrice({ cruiseId: 'cruise-001', adults: 1, children: [], serviceIds: [] });
            expect(result.cruise.name).toBe('Mediterranean Splendour');
            expect(result.cruise.durationNights).toBe(14);
        });
    });
});
