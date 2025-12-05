const express = require('express');
const router = express.Router();


// Controllers
const UserController = require('../apps/controllers/user');
const productController = require('../apps/controllers/product');


// Middlewares
const checkLoggedIn = require('../apps/middlewares/checkLoggedIn');





router.get('/', (req, res) => {
    res.send("API is working");
});


router.post('/register/customer', UserController.registerForCustomer);
router.post('/login/:role', UserController.login);
router.post('/register/staff', checkLoggedIn('admin'), UserController.registerForStaff);



router.get('/products', productController.index);
router.get('/products/:id', productController.show);


module.exports = router;