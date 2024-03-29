const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../work/product.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);
router.post('/create', product_controller.product_create);
router.get('/products', product_controller.product_getAll);
router.post('/update', product_controller.product_update);
router.post('/delete', product_controller.product_delete);
module.exports = router;