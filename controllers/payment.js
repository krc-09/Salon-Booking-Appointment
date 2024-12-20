const Razorpay = require('razorpay');
const Booking = require('../Models/Bookings');
const Users = require('../Models/users');
const { sendConfirmationEmail } = require('../Services/scheduleReminder');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id:'rzp_test_SWBS5uTl4oJ8b4' , 
    key_secret: 'LANHFKRy3xGuU29CyOXu0IsJ',
});

// Generate Access Token
const generateAccessToken = (id, name) => {
    const secret = process.env.TOKEN_SECRET || 'default_secret';
    return jwt.sign({ userId: id, name }, secret, { expiresIn: '1h' });
};

// Create Razorpay Order
const createOrder = async (req, res) => {
    try {
        const { amount, name, description, serviceId, date, time } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).send({ success: false, msg: 'Invalid amount' });
        }
        if (!name || typeof name !== 'string') {
            return res.status(400).send({ success: false, msg: 'Invalid name' });
        }
        if (!serviceId) {
            return res.status(400).send({ success: false, msg: 'Service ID is required' });
        }

        const options = {
            amount: amount * 100, // Razorpay requires amount in paise
            currency: 'INR',
            receipt: `${name}_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // Create Booking Entry in DB
        await req.user.createBooking({
            bookingid: order.id,
            status: 'PENDING',
            serviceId,
            date,
            time,
        });

        res.status(200).send({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            amount: options.amount,
            key_id: process.env.RAZORPAY_ID_KEY,
            product_name: name,
            description: description || 'Purchase',
        });
    } catch (error) {
        console.error('Error in createOrder:', error.message);
        res.status(500).send({ success: false, msg: 'Internal Server Error', error: error.message });
    }
};

// Update Transaction Status
const updateTransactionStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        const booking = await Booking.findOne({ where: { bookingid: orderId } });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update booking status
        await booking.update({ status: 'SUCCESSFUL' });

        await sendConfirmationEmail(booking.id);

        // Generate new token
        const newToken = generateAccessToken(req.user.id, req.user.name);

        res.status(202).json({
            success: true,
            message: 'Transaction successful',
            token: newToken,
        });
    } catch (err) {
        console.error('Error in updateTransactionStatus:', err.message);
        res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
    }
};

module.exports = { createOrder, updateTransactionStatus };
