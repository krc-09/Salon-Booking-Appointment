const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();



dotenv.config();




app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));


const Users = require('./Models/users'); 
const Salons = require('./Models/salons');
const Services = require('./Models/services');



const userRoutes = require('./routes/users');
const salonRoutes = require('./routes/salons');
const serviceRoutes = require('./routes/service');


app.use('/users', userRoutes);
app.use('/salons',salonRoutes);
app.use('/services',serviceRoutes);





const sequelize = require('./utils/database');
// Database relationships
Users.hasMany(Salons);
Salons.belongsTo(Users);




sequelize.sync()
  .then(result => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });