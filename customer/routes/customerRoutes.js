/**
 * @author: Nick Ma, haoxuanm
 * This routes is used to handle endpoints with customers, 
 * It calls controller
 */
const express = require('express');

const customerController = require('../controllers/customerController');
const router = express.Router();

router.post('/', customerController.addCustomer);
router.get('/:id', customerController.retrieveCustomerById);
router.get('/', customerController.retrieveCustomerByUserId);

module.exports = router;
