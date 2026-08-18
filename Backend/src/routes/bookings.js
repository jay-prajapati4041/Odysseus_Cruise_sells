'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { calculatePrice } = require('../pricing/rules');
const { validatePromoCode } = require('../promo/validator');

// In-memory store (starts from seed, cleared on restart)
let bookings = require('../data/bookings.json');
const promoCodesData = require('../data/promoCodes.json');

/**
 * POST /api/bookings/price
 * Calculate the price breakdown WITHOUT creating a booking.
 * Body: { cruiseId, adults, children: [{age}], serviceIds: [], promoCode?: string }
 */
router.post('/price', (req, res) => {
    const { cruiseId, adults, children = [], serviceIds = [], promoCode: promoCodeStr } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────────
    if (!cruiseId) {
        return res.status(400).json({ success: false, error: 'cruiseId is required.' });
    }
    if (!adults || typeof adults !== 'number' || adults < 1) {
        return res.status(400).json({ success: false, error: 'At least 1 adult is required.' });
    }
    if (!Array.isArray(children)) {
        return res.status(400).json({ success: false, error: 'children must be an array.' });
    }
    for (let i = 0; i < children.length; i++) {
        if (typeof children[i].age !== 'number' || children[i].age < 0) {
            return res.status(400).json({ success: false, error: `Child ${i + 1}: age must be a non-negative number.` });
        }
    }

    // ── Promo Code Validation ──────────────────────────────────────────────────
    let promoResult = null;
    let promoValidation = null;

    if (promoCodeStr && promoCodeStr.trim() !== '') {
        promoValidation = validatePromoCode(promoCodeStr, cruiseId);
        if (!promoValidation.valid) {
            return res.status(422).json({
                success: false,
                promoError: {
                    reason: promoValidation.reason,
                    message: promoValidation.message,
                },
            });
        }
        promoResult = promoValidation.promoDoc;
    }

    // ── Pricing ────────────────────────────────────────────────────────────────
    try {
        const breakdown = calculatePrice({ cruiseId, adults, children, serviceIds, promoCode: promoResult });
        return res.json({ success: true, data: breakdown });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/bookings/validate-promo
 * Validate a promo code for a cruise WITHOUT pricing.
 * Body: { cruiseId, promoCode }
 */
router.post('/validate-promo', (req, res) => {
    const { cruiseId, promoCode } = req.body;
    if (!cruiseId || !promoCode) {
        return res.status(400).json({ success: false, error: 'cruiseId and promoCode are required.' });
    }

    const result = validatePromoCode(promoCode, cruiseId);

    if (!result.valid) {
        return res.status(422).json({
            success: false,
            promoError: { reason: result.reason, message: result.message },
        });
    }

    return res.json({
        success: true,
        message: `Code "${promoCode}" is valid!`,
        discount: {
            type: result.promoDoc.type,
            value: result.promoDoc.value,
            description: result.promoDoc.description,
        },
    });
});

/**
 * POST /api/bookings
 * Confirm and create a booking.
 * Body: { cruiseId, adults, children: [{age}], serviceIds: [], promoCode?: string,
 *         leadPassenger: { firstName, lastName, email } }
 */
router.post('/', (req, res) => {
    const {
        cruiseId,
        adults,
        children = [],
        serviceIds = [],
        promoCode: promoCodeStr,
        leadPassenger,
    } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────────
    if (!cruiseId) return res.status(400).json({ success: false, error: 'cruiseId is required.' });
    if (!adults || typeof adults !== 'number' || adults < 1) {
        return res.status(400).json({ success: false, error: 'At least 1 adult is required.' });
    }
    if (!leadPassenger?.firstName || !leadPassenger?.lastName || !leadPassenger?.email) {
        return res.status(400).json({ success: false, error: 'leadPassenger firstName, lastName, and email are required.' });
    }

    // ── Promo ──────────────────────────────────────────────────────────────────
    let promoDoc = null;
    if (promoCodeStr && promoCodeStr.trim() !== '') {
        const promoValidation = validatePromoCode(promoCodeStr, cruiseId);
        if (!promoValidation.valid) {
            return res.status(422).json({
                success: false,
                promoError: { reason: promoValidation.reason, message: promoValidation.message },
            });
        }
        promoDoc = promoValidation.promoDoc;
    }

    // ── Price ──────────────────────────────────────────────────────────────────
    let breakdown;
    try {
        breakdown = calculatePrice({ cruiseId, adults, children, serviceIds, promoCode: promoDoc });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }

    // ── Increment promo usedCount ──────────────────────────────────────────────
    if (promoDoc) {
        const promoEntry = promoCodesData.find((p) => p.code === promoDoc.code);
        if (promoEntry) promoEntry.usedCount += 1;
    }

    // ── Create Booking ─────────────────────────────────────────────────────────
    const booking = {
        id: `BKG-${uuidv4().substring(0, 8).toUpperCase()}`,
        cruiseId,
        leadPassenger,
        adults,
        children,
        serviceIds,
        promoCode: promoCodeStr || null,
        breakdown,
        grandTotal: breakdown.grandTotal,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    return res.status(201).json({ success: true, data: booking });
});

/**
 * GET /api/bookings/:id
 * Retrieve a booking by ID.
 */
router.get('/:id', (req, res) => {
    const booking = bookings.find((b) => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found.' });
    }
    res.json({ success: true, data: booking });
});

module.exports = router;
