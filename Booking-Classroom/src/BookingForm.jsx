import React, { useState } from 'react';

const BookingForm = () => {
    const [classroom, setClassroom] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classroom, date, time }),
        });

        if (response.ok) {
            alert('Classroom booked successfully!');
            setClassroom('');
            setDate('');
            setTime('');
        } else {
            alert('Failed to book classroom.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Classroom:
                <input type="text" value={classroom} onChange={(e) => setClassroom(e.target.value)} required />
            </label>
            <label>
                Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>
                Time:
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </label>
            <button type="submit">Book</button>
        </form>
    );
};

export default BookingForm;
