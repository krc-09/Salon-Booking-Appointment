const express = require('express');
const staffController = require('../controllers/staff');
const authenticator =  require('../middleware/auth');
const router = express.Router();



router.post('/add-staff', authenticator.authenticate,staffController.addStaff);

module.exports = router;
