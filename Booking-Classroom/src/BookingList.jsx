import React, { useEffect, useState } from 'react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('/api/bookings');
            const data = await response.json();
            setBookings(data);
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <h2>View Bookings</h2>
            {bookings.map((booking, index) => (
                <div key={index}>
                    <p>Classroom: {booking.classroom}</p>
                    <p>Date: {booking.date}</p>
                    <p>Time: {booking.time}</p>
                </div>
            ))}
        </div>
    );
};

export default BookingList;
