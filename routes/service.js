const express = require('express');
const serviceController = require('../controllers/services');
const authenticator =  require('../middleware/auth');
const router = express.Router();



router.post('/add-services', authenticator.authenticate,serviceController.addService);
router.get('/get-services/:salonId',authenticator.authenticate, serviceController.getServices);





module.exports = router;
