const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.json()); // Parse JSON payloads

// Route to send confirmation email
exports.Bookingmail = async (req, res) => {
    const { email, service, date, time, paymentId } = req.body;

    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // Using Gmail as an example
            auth: {
                user: "your-email@gmail.com", // Replace with your email
                pass: "your-app-password", // Use app password for Gmail
            },
        });

        // Email content
        const mailOptions = {
            from: '"Salon Booking" <your-email@gmail.com>',
            to: email, // Recipient's email
            subject: "Booking Confirmation",
            html: `
                <h1>Booking Confirmed!</h1>
                <p>Thank you for booking with us. Here are your booking details:</p>
                <ul>
                    <li><strong>Service:</strong> ${service}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Payment ID:</strong> ${paymentId}</li>
                </ul>
                <p>We look forward to serving you!</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).send("Confirmation email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send confirmation email.");
    }
});

module.exports = app;
