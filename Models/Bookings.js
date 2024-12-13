const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database'); 
const Service = require('./services');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Services', // Table name of the Service model
            key: 'id',
        },
        onDelete: 'CASCADE', // Delete associated bookings if the service is deleted
        onUpdate: 'CASCADE', // Update the serviceId in bookings if the service's ID changes
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensure the customer's name is not empty
        },
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Ensure it's a valid email format
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true, // Ensure it's a valid date
        },
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensure the time slot is not empty
        },
        comment: 'Time slot for the booking (e.g., "10:00 AM - 11:00 AM")',
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
    tableName: 'Bookings', // Optional: Explicitly set the table name
});



module.exports = Booking;
