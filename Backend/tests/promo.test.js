'use strict';

const { validatePromoCode } = require('../src/promo/validator');

describe('Promo Code Validator – validatePromoCode()', () => {
    // We use a high subtotal (2000) so minimum spend is met for most tests
    const defCruise = 'cruise-001';
    const defSub = 2000;
    const defEmail = 'new@odysseuscruises.com';

    describe('REASON 1: INVALID MAP', () => {
        test('Unknown code returns INVALID', () => {
            const result = validatePromoCode('WRONG', defCruise, defSub, defEmail);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('INVALID');
        });
    });

    describe('REASON 2: EXPIRED / NOT YET VALID', () => {
        test('EXPIRED50 returns EXPIRED', () => {
            const result = validatePromoCode('EXPIRED50', defCruise, defSub, defEmail);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('EXPIRED');
        });
        test('FUTURE20 returns NOT_YET_VALID', () => {
            const result = validatePromoCode('FUTURE20', defCruise, defSub, defEmail);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('NOT_YET_VALID');
        });
    });

    describe('REASON 3: EXHAUSTED', () => {
        test('USED999 returns EXHAUSTED', () => {
            const result = validatePromoCode('USED999', defCruise, defSub, defEmail);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('EXHAUSTED');
        });
    });

    describe('REASON 4: CUSTOMER LIMIT REACHED', () => {
        test('TESTUSER returns limit reached if using same email', () => {
            const result = validatePromoCode('TESTUSER', defCruise, defSub, 'test@odysseuscruises.com');
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('CUSTOMER_LIMIT_REACHED');
            expect(result.message).toMatch(/maximum number of times/i);
        });
    });

    describe('REASON 5: MINIMUM SPEND NOT MET', () => {
        test('SAVE100 rejects if subtotal < 1000', () => {
            const result = validatePromoCode('SAVE100', defCruise, 500, defEmail);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('MINIMUM_SPEND_NOT_MET');
        });
    });

    describe('REASON 6: NOT_APPLICABLE', () => {
        test('SUMMER20 rejects if wrong cruise', () => {
            const result = validatePromoCode('SUMMER20', 'cruise-005', defSub, defEmail);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe('NOT_APPLICABLE');
        });
    });

    describe('VALID', () => {
        test('SUMMER20 accepts correct criteria', () => {
            const result = validatePromoCode('SUMMER20', 'cruise-001', 500, defEmail);
            expect(result.valid).toBe(true);
            expect(result.promoDoc.type).toBe('percent');
        });
        test('SAVE100 accepts if minimum spend met', () => {
            const result = validatePromoCode('SAVE100', 'cruise-005', 1000, defEmail);
            expect(result.valid).toBe(true);
            expect(result.promoDoc.value).toBe(100);
        });
        test('TESTUSER accepts if different email', () => {
            const result = validatePromoCode('TESTUSER', defCruise, defSub, 'another@odysseuscruises.com');
            expect(result.valid).toBe(true);
            expect(result.promoDoc.value).toBe(500);
        });
    });
});
