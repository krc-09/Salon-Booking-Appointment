const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Users = require('../Models/users');

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
    type: Sequelize.STRING,
    allowNull: false,
},
  
  
});

Users.hasMany(Booking, { foreignKey: 'userId', onDelete: 'CASCADE' }); // A user can have many bookings
Booking.belongsTo(Users, { foreignKey: 'userId' }); 
module.exports = Booking;
