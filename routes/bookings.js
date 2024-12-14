const express = require('express');
const bookingsController = require('../controllers/bookings');
const authenticator =  require('../middleware/auth');
const router = express.Router();



router.post('/create', authenticator.authenticate,bookingsController.postBookingDetails);






module.exports = router;
