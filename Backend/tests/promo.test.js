'use strict';

const { validatePromoCode } = require('../src/promo/validator');

describe('Promo Code Validator – validatePromoCode()', () => {
    // ── Reason 1: INVALID ─────────────────────────────────────────────────────
    describe('INVALID – code does not exist', () => {
        test('Unknown code returns INVALID reason', () => {
            const result = validatePromoCode('TOTALLYWRONG', 'cruise-001');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('INVALID');
        });

        test('INVALID message tells customer to check the code', () => {
            const result = validatePromoCode('BADCODE', 'cruise-001');
            expect(result.message).toMatch(/does not exist/i);
        });

        test('Empty string returns INVALID', () => {
            const result = validatePromoCode('', 'cruise-001');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('INVALID');
        });

        test('Null code returns INVALID', () => {
            const result = validatePromoCode(null, 'cruise-001');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('INVALID');
        });

        test('Code lookup is case-insensitive', () => {
            // SAVE100 exists, "save100" lowercase should still work
            const result = validatePromoCode('save100', 'cruise-001');
            expect(result.valid).toBe(true);
        });
    });

    // ── Reason 2: EXPIRED ────────────────────────────────────────────────────
    describe('EXPIRED – code past its expiry date', () => {
        test('EXPIRED50 code returns EXPIRED reason', () => {
            const result = validatePromoCode('EXPIRED50', 'cruise-001');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('EXPIRED');
        });

        test('EXPIRED message includes the expiry date', () => {
            const result = validatePromoCode('EXPIRED50', 'cruise-001');
            expect(result.message).toMatch(/expired/i);
            expect(result.message).toContain('2025');
        });

        test('EXPIRED returns no promoDoc', () => {
            const result = validatePromoCode('EXPIRED50', 'cruise-001');
            expect(result.promoDoc).toBeNull();
        });
    });

    // ── Reason 3: EXHAUSTED ──────────────────────────────────────────────────
    describe('EXHAUSTED – code has reached max uses', () => {
        test('USED999 code returns EXHAUSTED reason', () => {
            const result = validatePromoCode('USED999', 'cruise-001');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('EXHAUSTED');
        });

        test('EXHAUSTED message tells customer code is fully redeemed', () => {
            const result = validatePromoCode('USED999', 'cruise-001');
            expect(result.message).toMatch(/redeemed|exhausted|no longer available/i);
        });

        test('EXHAUSTED returns no promoDoc', () => {
            const result = validatePromoCode('USED999', 'cruise-001');
            expect(result.promoDoc).toBeNull();
        });
    });

    // ── Reason 4: NOT_APPLICABLE ─────────────────────────────────────────────
    describe('NOT_APPLICABLE – code not valid for this cruise', () => {
        test('GULF25 (cruise-005 only) rejected for cruise-001', () => {
            const result = validatePromoCode('GULF25', 'cruise-001');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('NOT_APPLICABLE');
        });

        test('GULF25 message tells customer not applicable to this cruise', () => {
            const result = validatePromoCode('GULF25', 'cruise-001');
            expect(result.message).toMatch(/not applicable/i);
        });

        test('GULF25 (cruise-005 only) is VALID for cruise-005', () => {
            const result = validatePromoCode('GULF25', 'cruise-005');
            expect(result.valid).toBe(true);
            expect(result.promoDoc).not.toBeNull();
        });

        test('ARCTIC10 (cruise-004 only) rejected for cruise-003', () => {
            const result = validatePromoCode('ARCTIC10', 'cruise-003');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('NOT_APPLICABLE');
        });
    });

    // ── Valid Codes ───────────────────────────────────────────────────────────
    describe('Valid codes – all checks pass', () => {
        test('SAVE100 is valid for any cruise (applicableCruiseIds is null)', () => {
            const result = validatePromoCode('SAVE100', 'cruise-001');
            expect(result.valid).toBe(true);
            expect(result.reason).toBeNull();
            expect(result.message).toBeNull();
        });

        test('SAVE100 returns correct promoDoc', () => {
            const result = validatePromoCode('SAVE100', 'cruise-003');
            expect(result.promoDoc.type).toBe('fixed');
            expect(result.promoDoc.value).toBe(100);
        });

        test('SUMMER20 valid for cruise-001 (in applicableCruiseIds)', () => {
            const result = validatePromoCode('SUMMER20', 'cruise-001');
            expect(result.valid).toBe(true);
            expect(result.promoDoc.type).toBe('percent');
            expect(result.promoDoc.value).toBe(20);
        });

        test('SUMMER20 NOT_APPLICABLE for cruise-004 (Alaska – not in list)', () => {
            const result = validatePromoCode('SUMMER20', 'cruise-004');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('NOT_APPLICABLE');
        });
    });
});
