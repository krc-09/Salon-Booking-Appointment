const express = require('express');
const Booking = require('../Models/Bookings'); // Ensure correct path to model
const razorpay = require('razorpay'); // Include Razorpay SDK if you haven't already

const app = express();
app.use(express.json()); // Parse JSON payloads

// Function to handle booking post request
exports.postBookingDetails = async (req, res) => {
    const { serviceId, date, time, payment_id } = req.body;

    // Check if payment_id and serviceId are valid
    if (!payment_id || !serviceId) {
        return res.status(400).send('Invalid booking details');
    }

    try {
        // Validate Razorpay payment
        const isValidPayment = await validatePayment(payment_id);
        if (!isValidPayment) {
            return res.status(400).send('Invalid payment');
        }

        // Generate a unique booking ID
        const bookingId = `BOOKING-${Date.now()}`;
        const status = 'confirmed'; // Change this based on your application logic

        // Save the booking in the database
        const booking = await Booking.create({
            paymentid: payment_id,
            bookingid: bookingId,
            status: status,
            serviceid: serviceId,
            // Add other details like date and time if necessary
        });

        res.status(201).json({ message: 'Booking confirmed', booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send('Error confirming booking');
    }
};


// Function to validate Razorpay payment
async function validatePayment(paymentId) {
    // Optional: Verify payment with Razorpay
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment.status === 'captured';
    } catch (error) {
        console.error('Error validating payment:', error);
        return false;
    }
}

