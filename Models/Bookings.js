const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Users = require('../Models/users');
const Service = require('../Models/services');

const Booking = sequelize.define('booking', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
 
  bookingid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  serviceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Service,    // Reference to the Service model
      key: 'id',         // Link to the 'id' field in the Service table
    },
},
  
date: {
  type: Sequelize.DATEONLY,
  allowNull: false,
  defaultValue: Sequelize.NOW, // Use Sequelize's NOW for a default date
},
time: {
  type: Sequelize.STRING, // Correctly defined as STRING for "10AM-11AM"
  allowNull: false,
},
});
Users.hasMany(Booking, { foreignKey: 'userId', onDelete: 'CASCADE' }); // A user can have many bookings
Booking.belongsTo(Users, { foreignKey: 'userId' }); 

Service.hasMany(Booking, { foreignKey: 'serviceId' });  // A service can have many bookings
Booking.belongsTo(Service, { foreignKey: 'serviceId' }); 
module.exports = Booking;
