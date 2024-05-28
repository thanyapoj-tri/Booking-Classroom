const express = require('express');
const router = express.Router();

let bookings = [];

// Endpoint to get all bookings
router.get('/', (req, res) => {
    res.json(bookings);
});

// Endpoint to book a classroom
router.post('/', (req, res) => {
    const { classroom, date, time } = req.body;
    if (classroom && date && time) {
        bookings.push({ classroom, date, time });
        res.status(200).json({ message: 'Classroom booked successfully.' });
    } else {
        res.status(400).json({ message: 'Invalid booking data.' });
    }
});

module.exports = router;
