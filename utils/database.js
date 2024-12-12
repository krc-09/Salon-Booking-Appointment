const Sequelize = require('sequelize');
const sequelize = new Sequelize('salon-appointment','root','password',{

    dialect : 'mysql',
    host:'localhost'

});
module.exports = sequelize;