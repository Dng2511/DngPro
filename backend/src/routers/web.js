const express = require('express');
const router = express.Router();

const productController = require('../apps/controllers/product');
const orderController = require('../apps/controllers/order');
router.get('/', (req, res) => {
    res.send("API is working");
});

router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/orders', orderController.order);

module.exports = router;