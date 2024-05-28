const express = require('express');
const path = require('path');
const app = express();
const bookingRouter = require('./booking');

app.use(express.json());
app.use('/api/bookings', bookingRouter);

// Serve the React frontend
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(8080, () => {
    console.log('Backend server is running on http://localhost:8080');
});
