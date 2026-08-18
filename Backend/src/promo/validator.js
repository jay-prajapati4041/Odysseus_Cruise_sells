/**
 * Odysseus Cruise Booking – Promotional Code Validator
 *
 * Enforces attributes: Date range, total uses, per-customer uses, minimum spend.
 */

'use strict';

const promoCodesData = require('../data/promoCodes.json');

/**
 * Validate a promotional code for a given booking request.
 *
 * @param {string} code           – The code entered by the customer
 * @param {string} cruiseId       – The cruise being booked
 * @param {number} subtotal       – The booking subtotal (used for minimumSpend)
 * @param {string|null} email     – Customer email (used for maxUsesPerCustomer)
 * @returns {{ valid: boolean, promoDoc: object|null, reason: string|null, message: string|null }}
 */
function validatePromoCode(code, cruiseId, subtotal, email = null) {
    if (!code || code.trim() === '') {
        return { valid: false, promoDoc: null, reason: 'INVALID', message: 'No promotional code was provided.' };
    }

    const upperCode = code.trim().toUpperCase();

    // 1. EXISTENCE
    const promo = promoCodesData.find((p) => p.code.toUpperCase() === upperCode);
    if (!promo) {
        return { valid: false, promoDoc: null, reason: 'INVALID', message: `The promotional code "${code}" does not exist.` };
    }

    // 2. DATE LIMIT (Valid From / Valid To)
    const now = new Date();
    // Reset time to start of day for comparison
    now.setHours(0, 0, 0, 0);
    const validFrom = new Date(promo.validFrom);
    const validTo = new Date(promo.validTo);

    if (now < validFrom) {
        return {
            valid: false, promoDoc: null, reason: 'NOT_YET_VALID',
            message: `The code "${code}" is only valid starting from ${validFrom.toLocaleDateString('en-GB')}.`
        };
    }
    if (now > validTo) {
        return {
            valid: false, promoDoc: null, reason: 'EXPIRED',
            message: `The code "${code}" expired on ${validTo.toLocaleDateString('en-GB')}.`
        };
    }

    // 3. MAXIMUM TOTAL USES
    if (promo.usedCount >= promo.maxTotalUses) {
        return {
            valid: false, promoDoc: null, reason: 'EXHAUSTED',
            message: `The code "${code}" has reached its global usage limit.`
        };
    }

    // 4. MAXIMUM USES PER CUSTOMER
    if (email) {
        const customerEmail = email.toLowerCase().trim();
        const usesByCustomer = promo.customerUsages[customerEmail] || 0;
        if (usesByCustomer >= promo.maxUsesPerCustomer) {
            return {
                valid: false, promoDoc: null, reason: 'CUSTOMER_LIMIT_REACHED',
                message: `You have already used the code "${code}" the maximum number of times (${promo.maxUsesPerCustomer}).`
            };
        }
    }

    // 5. MINIMUM SPEND
    if (subtotal < promo.minimumSpend) {
        return {
            valid: false, promoDoc: null, reason: 'MINIMUM_SPEND_NOT_MET',
            message: `The code "${code}" requires a minimum spend of £${promo.minimumSpend}. Your subtotal is £${subtotal}.`
        };
    }

    // 6. CRUISE APPLICABILITY
    if (promo.applicableCruiseIds !== null && !promo.applicableCruiseIds.includes(cruiseId)) {
        return {
            valid: false, promoDoc: null, reason: 'NOT_APPLICABLE',
            message: `The code "${code}" is not applicable to this cruise.`
        };
    }

    return { valid: true, promoDoc: promo, reason: null, message: null };
}

module.exports = { validatePromoCode };
