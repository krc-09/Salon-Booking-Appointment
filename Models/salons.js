const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database'); // Assume database config is in this file

const Salon = sequelize.define('Salon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 15], // Ensure contact number is between 10 and 15 digits
        },
    },
    ownerName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true, // To automatically add `createdAt` and `updatedAt`
});

module.exports = Salon;
