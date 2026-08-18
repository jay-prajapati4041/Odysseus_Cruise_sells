'use strict';

const express = require('express');
const cors = require('cors');

const cruisesRouter = require('./routes/cruises');
const bookingsRouter = require('./routes/bookings');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Odysseus Cruise API is up and running.' });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/cruises', cruisesRouter);
app.use('/api/bookings', bookingsRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found.` });
});

// ── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'An unexpected error occurred.' });
});

module.exports = app;
