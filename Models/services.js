const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database'); // Update the path to your Sequelize instance if needed
const Salon = require('../Models/salons')

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Ensure the service name is not empty
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional detailed description
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true, // Ensure the price is a valid number
            min: 0, // Price must be zero or positive
        },
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true, // Duration must be an integer
            min: 1, // Minimum duration is 1 minute
        },
        comment: 'Duration in minutes',
    },
    salonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Salons', // Must match the table name of the Salon model
            key: 'id',
        },
        onDelete: 'CASCADE', // Delete associated services if the salon is deleted
        onUpdate: 'CASCADE', // Update the salonId in services if the salon's ID changes
    },
   // In your Sequelize Service model
slots: {
    type: DataTypes.JSON, // Use JSON to store the array of strings
    allowNull: false,
},

}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
    tableName: 'Services', // Optional: Explicitly set the table name
});



Salon.hasMany(Service, { foreignKey: 'salonId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Service.belongsTo(Salon, { foreignKey: 'salonId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports = Service;
