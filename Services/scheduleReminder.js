const nodemailer = require('nodemailer');
const User = require('../Models/users'); 
const Service = require('../Models/services'); // Corrected model name
const Booking = require('../Models/Bookings');
const Salon = require('../Models/salons')

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
        // Retrieve booking details
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: User,
                    attributes: ['email', 'name']
                },
                {
                    model: Service,
                    attributes: ['name', 'salonId'],
                    include: {
                        model: Salon,
                        attributes: ['name']
                    }
                }
            ]
        });

        // Log the fetched booking for debugging
        console.log('Fetched Booking:', JSON.stringify(booking, null, 2));

        // Check if booking and associations exist
        if (!booking || !booking.user || !booking.Service || !booking.Service.Salon) {
            throw new Error('Booking, associated user, service, or salon not found');
        }

        // Extract details
        const userEmail = booking.user.email;
        const userName = booking.user.name;
        const serviceName = booking.Service.name;
        const salonName = booking.Service.Salon.name;

        // Define email options
        const mailOptions = {
            from: { name: 'Salon-Point', address: 'kankanarc2020@gmail.com' },
            to: userEmail,
            subject: 'Booking Confirmation',
            text: `Dear ${userName},\n\nYour booking with ID ${booking.id} has been successfully confirmed!\n\nService: ${serviceName}\nSalon: ${salonName}\n\nThank you for choosing our service.\n\nBest Regards,\nSalon-Point`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending confirmation email:', error.message);
    }
};

const sendReminderEmail = async (bookingId) => {
    try {
        // Retrieve booking details
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: User,
                    attributes: ['email', 'name']
                },
                {
                    model: Service,
                    attributes: ['name', 'salonId'],
                    include: {
                        model: Salon,
                        attributes: ['name']
                    }
                }
            ]
        });

        // Log the fetched booking for debugging
        console.log('Fetched Booking for Reminder:', JSON.stringify(booking, null, 2));

        // Check if booking and associations exist
        if (!booking || !booking.user || !booking.Service || !booking.Service.Salon) {
            throw new Error('Booking, associated user, service, or salon not found');
        }

        // Extract details
        const userEmail = booking.user.email;
        const userName = booking.user.name;
        const serviceName = booking.Service.name;
        const salonName = booking.Service.Salon.name;

        // Define reminder email options
        const mailOptions = {
            from: { name: 'Salon-Point', address: 'kankanarc2020@gmail.com' },
            to: userEmail,
            subject: 'Appointment Reminder',
            text: `Dear ${userName},\n\nThis is a friendly reminder for your upcoming appointment.\n\nService: ${serviceName}\nSalon: ${salonName}\nDate and Time: ${booking.date}\n\nWe look forward to serving you!\n\nBest Regards,\nSalon-Point`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent successfully!');
    } catch (error) {
        console.error('Error sending reminder email:', error.message);
    }
};


module.exports = { sendConfirmationEmail ,sendReminderEmail};
