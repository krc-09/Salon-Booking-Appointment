const express = require('express');
const salonsController = require('../controllers/salon');
const authenticator =  require('../middleware/auth');
const router = express.Router();



router.post('/add-salons', authenticator.authenticate,salonsController.postSalonDetails);
router.get('/get-salon/:salonId',authenticator.authenticate, salonsController.getSalonDetails);
router.get('/get-salons', authenticator.authenticate, salonsController.getAllSalons);
router.get('/get-salons-by-user', authenticator.authenticate, salonsController.getSalonsByUser);






module.exports = router;
