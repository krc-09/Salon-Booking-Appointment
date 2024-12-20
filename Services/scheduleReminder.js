const nodemailer = require('nodemailer');
const User = require('../Models/users'); 
const Service = require('../Models/services'); // Corrected model name
const Booking = require('../Models/Bookings');

require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'kankanarc2020@gmail.com',
        pass: 'riqufsdrkrovvccm'
    }
});

const sendConfirmationEmail = async (bookingId) => {
    try {
        // Retrieve booking details, associated user, and service details
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: User,
                    attributes: ['email', 'name'] // Include necessary fields for User
                },
                {
                    model: Service,
                    attributes: ['name'] // Include the service name from the Service model
                }
            ]
        });

        // Check if booking or associated models are found
        if (!booking || !booking.user || !booking.Service) {
            throw new Error('Booking, associated user, or service not found');
        }

        // Extract necessary details
        const userEmail = booking.user.email;
        const userName = booking.user.name;
        const serviceName = booking.Service.name; // Accessing the service name
        const salonName = "Your Salon Name"; // Replace with actual salon name if needed

        console.log("Booking ID:", booking.id);
        console.log("User Email:", userEmail);
        console.log("Service Name:", serviceName);

        // Define email options
        const mailOptions = {
            from: {
                name: 'Salon-Point',
                address: 'kankanarc2020@gmail.com'
            },
            to: userEmail,
            subject: 'Booking Confirmation',
            text: `Dear ${userName},\n\nYour booking with ID ${booking.id} has been successfully confirmed!\n\nService: ${serviceName}\nSalon: ${salonName}\n\nThank you for choosing our service.\n\nBest Regards,\nYour Company`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending confirmation email:', error.message);
    }
};


module.exports = { sendConfirmationEmail };
