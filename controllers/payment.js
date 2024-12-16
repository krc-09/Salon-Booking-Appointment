const Razorpay = require('razorpay');
const Booking = require('../Models/Bookings');
const Users = require('../Models/users')
const jwt = require('jsonwebtoken');
require('dotenv').config(); 




const razorpayInstance = new Razorpay({
    key_id:'rzp_test_SWBS5uTl4oJ8b4' ,
    key_secret:'LANHFKRy3xGuU29CyOXu0IsJ',
});

const createOrder = async (req, res) => {
    console.log('Request Body:', req.body);

    try {
        const { amount, 
            name, 
            description, 
            serviceId,
            date,
            time } = req.body;

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
            amount: amount , // Convert to paise
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
        await req.user.createBooking({
                            bookingid: order.id, 
                                status: 'PENDING',
                                serviceId,date,time
                               
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
        console.log('Request Body:', req.body); // Debug incoming request body

        const { orderId } = req.body; // Use orderId as per the request body

        // Validate orderId
        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        // Find the booking using bookingid (mapped from orderId)
        const order = await Booking.findOne({ where: { bookingid: orderId } });

        // If booking not found
        if (!order) {
            console.log('Order not found for:', { orderId });
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        console.log('Order Found:', order); // Debug found order

        // Update the status to 'SUCCESSFUL'
        await order.update({ status: 'SUCCESSFUL' });

        // Generate a new token for the user
        const newToken = generateAccessToken(req.user.id, req.user.name);

        return res.status(202).json({
            success: true,
            message: 'Transaction successful',
            token: newToken,
        });
    } catch (err) {
        console.error('Error in updateTransactionStatus:', err.message); // Log error details
        res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
    }
};



module.exports = { createOrder, updateTransactionStatus };
