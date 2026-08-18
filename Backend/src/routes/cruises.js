'use strict';

const express = require('express');
const router = express.Router();
const cruisesData = require('../data/cruises.json');

/**
 * GET /api/cruises
 * Returns all available cruises.
 */
router.get('/', (req, res) => {
    // Only return cruises with availability > 0
    const available = cruisesData.filter((c) => c.availability > 0);
    res.json({ success: true, data: available });
});

/**
 * GET /api/cruises/:id
 * Returns a single cruise with full service details.
 */
router.get('/:id', (req, res) => {
    const cruise = cruisesData.find((c) => c.id === req.params.id);
    if (!cruise) {
        return res.status(404).json({ success: false, error: 'Cruise not found.' });
    }
    res.json({ success: true, data: cruise });
});

module.exports = router;
