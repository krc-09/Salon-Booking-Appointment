const Booking = require('../Models/Bookings'); // Import Booking model
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: 'kankanarc2020@gmail.com', // Your email
        pass: 'Survival@420', // App password for your email
    },
});

// Function to Send Reminder Emails
const sendReminderEmail = async ({ email, name, date, time }) => {
    try {
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Service Reminder',
            text: `Dear ${name},\n\nThis is a friendly reminder for your service scheduled on ${date} at ${time}.\n\nThank you for choosing us!`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

// Function to Query Bookings and Send Reminders
const sendRemindersForToday = async () => {
    try {
        const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

        // Query bookings and include user details
        const bookings = await Booking.findAll({
            where: {
                date: today,
            },
            include: [
                {
                    model: Users,
                    attributes: ['emailId', 'name'], // Specify the fields you need from Users table
                },
            ],
        });

        if (bookings.length === 0) {
            console.log('No bookings found for today.');
            return;
        }

        // Send reminder emails for each booking
        for (const booking of bookings) {
            const user = booking.User; // Access the associated User model
            if (user && user.emailId) {
                await sendReminderEmail({
                    email: user.emailId,
                    name: user.name,
                    date: booking.date,
                    time: booking.time,
                });
            } else {
                console.log(`No email found for user with ID: ${booking.userId}`);
            }
        }
    } catch (error) {
        console.error('Error fetching bookings or sending emails:', error.message);
    }
};

// Schedule the Job to Run Daily
const scheduleDailyReminders = () => {
    schedule.scheduleJob('0 8 * * *', async () => {
        console.log('Running daily reminder job...');
        await sendRemindersForToday();
    });
};

module.exports = { scheduleDailyReminders, sendReminderEmail };
