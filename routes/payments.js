const express = require('express');
const paymentsController = require('../controllers/payment');
const authenticator =  require('../middleware/auth');
const router = express.Router();



router.post('/initiate', authenticator.authenticate,paymentsController.createOrder);
router.post('/confirm-payment', authenticator.authenticate, paymentsController.updateTransactionStatus);






module.exports = router;
