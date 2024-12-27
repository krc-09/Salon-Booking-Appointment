const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database'); // Update the path to your Sequelize instance if needed
const Salons = require('../Models/salons');
const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensure the staff name is not empty
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensure the email is in the correct format
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensure the phone number is not empty
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Staff', // Default role
      
    },
    services: {
        type: DataTypes.JSON, // Store the array of services as JSON
        allowNull: true, // Optional: Staff can have no services initially
     
    },
    salonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Salons', // Must match the table name of the Salon model
            key: 'id',
        },
        onDelete: 'CASCADE', // Delete associated staff if the salon is deleted
        onUpdate: 'CASCADE', // Update the salonId in staff if the salon's ID changes
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
    tableName: 'Staff', // Optional: Explicitly set the table name
});


module.exports = Staff;
