/**
 * Odysseus Cruise Booking – Promotional Code Validator
 *
 * Rejection reasons (FR 4):
 *  1. INVALID    – code does not exist in the system
 *  2. EXPIRED    – code's expiresAt date is in the past
 *  3. EXHAUSTED  – code has reached its maxUses limit
 *  4. NOT_APPLICABLE – code is not valid for the requested cruise
 *
 * The customer is always told WHICH of the four reasons applies.
 */

'use strict';

const promoCodesData = require('../data/promoCodes.json');

/**
 * Validate a promotional code for a given cruise.
 *
 * @param {string} code       – The code entered by the customer (case-insensitive)
 * @param {string} cruiseId   – The cruise being booked
 * @returns {{ valid: boolean, promoDoc: object|null, reason: string|null, message: string|null }}
 */
function validatePromoCode(code, cruiseId) {
    if (!code || code.trim() === '') {
        return { valid: false, promoDoc: null, reason: 'INVALID', message: 'No promotional code was provided.' };
    }

    const upperCode = code.trim().toUpperCase();

    // 1. INVALID – does the code exist?
    const promo = promoCodesData.find((p) => p.code.toUpperCase() === upperCode);
    if (!promo) {
        return {
            valid: false,
            promoDoc: null,
            reason: 'INVALID',
            message: `The promotional code "${code}" does not exist. Please check the code and try again.`,
        };
    }

    // 2. EXPIRED – is the code past its expiry date?
    const now = new Date();
    const expiry = new Date(promo.expiresAt);
    if (now > expiry) {
        return {
            valid: false,
            promoDoc: null,
            reason: 'EXPIRED',
            message: `The promotional code "${code}" expired on ${expiry.toLocaleDateString('en-GB')} and is no longer valid.`,
        };
    }

    // 3. EXHAUSTED – has the code reached its usage limit?
    if (promo.usedCount >= promo.maxUses) {
        return {
            valid: false,
            promoDoc: null,
            reason: 'EXHAUSTED',
            message: `The promotional code "${code}" has already been fully redeemed and is no longer available.`,
        };
    }

    // 4. NOT_APPLICABLE – is the code restricted to specific cruises?
    if (promo.applicableCruiseIds !== null && !promo.applicableCruiseIds.includes(cruiseId)) {
        return {
            valid: false,
            promoDoc: null,
            reason: 'NOT_APPLICABLE',
            message: `The promotional code "${code}" is not applicable to this cruise.`,
        };
    }

    // All checks passed
    return {
        valid: true,
        promoDoc: promo,
        reason: null,
        message: null,
    };
}

module.exports = { validatePromoCode };
