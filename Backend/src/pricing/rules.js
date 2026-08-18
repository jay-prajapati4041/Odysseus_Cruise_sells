/**
 * Odysseus Cruise Booking – Pricing Rules Engine
 *
 * Section 5 – Pricing Rules (Cruise Fare):
 *  - Adult        : 100% of cruise baseAdultPrice
 *  - Age 0–4      : FREE (0% of adult fare)
 *  - Age 5–11     : 50% of adult fare
 *  - Age 12–17    : 75% of adult fare
 *  - Age 18+      : Full adult fare (100%)
 *  - Optional services: per_person × total travellers OR flat per_booking fee
 *  - Promo discount applied AFTER full subtotal (base + services)
 *  - Returns a full itemised breakdown, not just a total
 */

'use strict';

const cruisesData = require('../data/cruises.json');

/**
 * Calculate total price and itemised breakdown for a booking.
 *
 * @param {object} params
 * @param {string} params.cruiseId
 * @param {number} params.adults            – number of adult passengers (≥ 1)
 * @param {Array<{age: number}>} params.children  – array of child objects with age
 * @param {string[]} params.serviceIds      – IDs of chosen optional services
 * @param {object|null} params.promoCode    – validated promo doc, or null
 * @returns {{ breakdown: object, grandTotal: number }}
 */
function calculatePrice({ cruiseId, adults, children = [], serviceIds = [], promoCode = null }) {
    const cruise = cruisesData.find((c) => c.id === cruiseId);
    if (!cruise) {
        throw new Error(`Cruise not found: ${cruiseId}`);
    }

    const breakdown = {
        cruise: {
            id: cruise.id,
            name: cruise.name,
            departureDate: cruise.departureDate,
            durationNights: cruise.durationNights,
        },
        passengers: [],
        services: [],
        subtotal: 0,
        discount: null,
        grandTotal: 0,
    };

    let passengerTotal = 0;

    // ── Adults ──────────────────────────────────────────────────────────────────
    const adultLineTotal = adults * cruise.baseAdultPrice;
    breakdown.passengers.push({
        type: 'Adults',
        count: adults,
        unitPrice: cruise.baseAdultPrice,
        lineTotal: adultLineTotal,
    });
    passengerTotal += adultLineTotal;

    // ── Children ────────────────────────────────────────────────────────────────
    children.forEach((child, index) => {
        const age = child.age;
        let category, unitPrice, lineTotal;

        if (age <= 4) {
            category = 'Child (0–4) – Free';
            unitPrice = 0;
            lineTotal = 0;
        } else if (age <= 11) {
            category = 'Child (5–11) – 50% of adult fare';
            unitPrice = Math.round(cruise.baseAdultPrice * 0.5 * 100) / 100;
            lineTotal = unitPrice;
        } else if (age <= 17) {
            category = 'Child (12–17) – 75% of adult fare';
            unitPrice = Math.round(cruise.baseAdultPrice * 0.75 * 100) / 100;
            lineTotal = unitPrice;
        } else {
            category = 'Adult fare (18+)';
            unitPrice = cruise.baseAdultPrice;
            lineTotal = cruise.baseAdultPrice;
        }

        breakdown.passengers.push({
            type: `Child ${index + 1} – Age ${age} – ${category}`,
            count: 1,
            unitPrice,
            lineTotal,
        });
        passengerTotal += lineTotal;
    });

    // ── Total travellers (used for per_person services) ─────────────────────────
    const totalTravellers = adults + children.length;

    // ── Group Discount ──────────────────────────────────────────────────────────
    let groupDiscountAmount = 0;
    if (totalTravellers >= 5) {
        groupDiscountAmount = Math.round((passengerTotal * 0.10) * 100) / 100;
        breakdown.groupDiscount = {
            description: '10% Group Discount (5–6 pax)',
            pct: 10,
            amount: -groupDiscountAmount
        };
    } else if (totalTravellers >= 3) {
        groupDiscountAmount = Math.round((passengerTotal * 0.05) * 100) / 100;
        breakdown.groupDiscount = {
            description: '5% Group Discount (3–4 pax)',
            pct: 5,
            amount: -groupDiscountAmount
        };
    } else {
        breakdown.groupDiscount = null;
    }

    // ── Optional Services ───────────────────────────────────────────────────────
    let servicesTotal = 0;

    if (serviceIds && serviceIds.length > 0) {
        serviceIds.forEach((svcId) => {
            const svc = cruise.availableServices.find((s) => s.id === svcId);
            if (!svc) return; // silently skip unknown IDs

            let lineTotal;
            let pricingNote;

            if (svc.pricingType === 'per_person') {
                lineTotal = svc.price * totalTravellers;
                pricingNote = `£${svc.price} × ${totalTravellers} travellers`;
            } else if (svc.pricingType === 'per_person_per_night') {
                lineTotal = svc.price * totalTravellers * cruise.durationNights;
                pricingNote = `£${svc.price} × ${totalTravellers} travellers × ${cruise.durationNights} nights`;
            } else {
                // per_booking
                lineTotal = svc.price;
                pricingNote = `£${svc.price} per booking`;
            }

            breakdown.services.push({
                id: svc.id,
                name: svc.name,
                pricingNote,
                lineTotal,
            });

            servicesTotal += lineTotal;
        });
    }

    const subtotal = passengerTotal + servicesTotal;
    breakdown.subtotal = subtotal;

    // ── Promotional Discount ────────────────────────────────────────────────────
    let discountAmount = 0;

    // Promo applies to passengerTotal after group discount, plus services? 
    // Wait, let's keep it simple: apply promo code discount directly to subtotal minus group discount.
    const amountForPromo = subtotal - groupDiscountAmount;

    if (promoCode) {
        if (promoCode.type === 'percent') {
            discountAmount = Math.round((amountForPromo * promoCode.value) / 100 * 100) / 100;
            breakdown.discount = {
                code: promoCode.code,
                description: `${promoCode.value}% off`,
                amount: -discountAmount,
            };
        } else if (promoCode.type === 'fixed') {
            discountAmount = Math.min(promoCode.value, amountForPromo); // can't go negative
            breakdown.discount = {
                code: promoCode.code,
                description: `£${promoCode.value} off`,
                amount: -discountAmount,
            };
        }
    }

    const preTaxTotal = Math.max(0, subtotal - groupDiscountAmount - discountAmount);
    const tax = Math.round((preTaxTotal * 0.12) * 100) / 100;

    breakdown.tax = tax;
    breakdown.grandTotal = Math.round((preTaxTotal + tax) * 100) / 100;

    return breakdown;
}

module.exports = { calculatePrice };
