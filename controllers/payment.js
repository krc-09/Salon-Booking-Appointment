const Razorpay = require('razorpay');
const Booking = require('../Models/Bookings');
const Users = require('../Models/users')
const jwt = require('jsonwebtoken');
require('dotenv').config(); 


// const purchasebooking = async (req, res) => {
//     try {
//         console.log('Request body received:', req.body);

//         const { price, serviceid } = req.body;
//         if (!price || isNaN(price)) {
//             return res.status(400).json({ message: 'Valid price is required' });
//         }

//         const rzp = new Razorpay({
//             key_id: "rzp_test_SWBS5uTl4oJ8b4" ,// Hardcoded value for testing
//     key_secret:" LANHFKRy3xGuU29CyOXu0IsJ ",
//         });

//         const amount = price * 100;

//         rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
//             if (err) {
//                 console.error('Error creating Razorpay order:', err);
//                 return res.status(400).json({ message: 'Failed to create order', error: err });
//             }

//             try {
//                 if (!req.user) {
//                     return res.status(401).json({ message: 'User not authenticated' });
//                 }

//                 // Create a new booking using the associated model
//                 await req.user.createBooking({
//                     bookingid: order.id, // Razorpay order ID
//                     status: 'PENDING',
//                     serviceid,
//                     paymentid: null,
//                 });
                

//                 return res.status(201).json({ order, key_id: rzp.key_id });
//             } catch (createBookingError) {
//                 console.error('Error creating user booking:', createBookingError);
//                 return res.status(500).json({ message: 'Failed to save booking to database', error: createBookingError });
//             }
//         });
//     } catch (err) {
//         console.error('Unexpected error:', err);
//         res.status(500).json({ message: 'Something went wrong', error: err.message });
//     }
// };

const razorpayInstance = new Razorpay({
    key_id:'rzp_test_SWBS5uTl4oJ8b4' ,
    key_secret:'LANHFKRy3xGuU29CyOXu0IsJ',
});

const createOrder = async (req, res) => {
    console.log('Request Body:', req.body);

    try {
        const { amount, name, description } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).send({ success: false, msg: 'Invalid amount' });
        }
        if (!name || typeof name !== 'string') {
            return res.status(400).send({ success: false, msg: 'Invalid name' });
        }

        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `${name}_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        console.log('Order Created:', order);

        res.status(200).send({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            amount: options.amount,
            key_id: process.env.RAZORPAY_ID_KEY,
            product_name: name,
            description: description || 'Purchase',
            contact: '7596934199',
            name: 'Kankana Roychowdhury',
            email: 'kankanarc2020@gmail.com',
        });
    } catch (error) {
        console.error('Error in createOrder:', error); // Log the entire error object
        res.status(500).send({ success: false, msg: 'Internal Server Error', error: error.message || error });
    }
    
};

const generateAccessToken = (id, name) => {
    const secret = process.env.TOKEN_SECRET || 'default_secret';
    return jwt.sign({ userId: id, name: name }, secret, { expiresIn: '1h' });
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        if (!payment_id || !order_id) {
            return res.status(400).json({ success: false, message: 'Invalid payment or order ID' });
        }

        const order = await Booking.findOne({ where: { bookingid: order_id } });
        if (!order) {
            console.log('Order not found for:', { order_id });
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        const newToken = generateAccessToken(req.user.id, req.user.name);

        return res.status(202).json({
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
