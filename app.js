const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { sendReminderEmail } = require('./Services/scheduleReminder');





const app = express();
app.use(express.json());

app.use(bodyParser.json()); 



dotenv.config();




app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));


const Users = require('./Models/users'); 
const Salons = require('./Models/salons');
const Bookings = require('./Models/Bookings');






const userRoutes = require('./routes/users');
const salonRoutes = require('./routes/salons');
const serviceRoutes = require('./routes/service');
const paymentRoutes = require('./routes/payments');



app.use('/users', userRoutes);
app.use('/salons',salonRoutes);
app.use('/services',serviceRoutes);
app.use('/payments',paymentRoutes);






const sequelize = require('./utils/database');
// Database relationships
Users.hasMany(Salons);
Salons.belongsTo(Users);
Users.hasMany(Bookings);
Bookings.belongsTo(Users);


cron.schedule('0 9 * * *', async () => {
  console.log('Running reminder email job...');
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  try {
      // Find bookings for today
      const bookings = await Bookings.findAll({
          where: { date: today } // Assumes `date` field in Booking model stores the date in YYYY-MM-DD
      });

      // Send reminder emails for each booking
      bookings.forEach((booking) => {
          sendReminderEmail(booking.id);
      });

      console.log(`Reminder emails sent for ${bookings.length} bookings.`);
  } catch (error) {
      console.error('Error running reminder email job:', error.message);
  }
});




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
