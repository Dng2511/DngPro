const express = require('express');
const router = express.Router();


// Controllers
const UserController = require('../apps/controllers/user');
const productController = require('../apps/controllers/product');
const categoryCtrl = require('../apps/controllers/category');
const orderController = require('../apps/controllers/order');



// Middlewares
const checkLoggedIn = require('../apps/middlewares/checkLoggedIn');




router.get('/', (req, res) => {
    res.send("API is working");
});


router.post('/register/customer', UserController.registerForCustomer);
router.post('/login/:role', UserController.login);
router.post('/register/staff', checkLoggedIn('admin'), UserController.registerForStaff);
router.get('/profile', checkLoggedIn('customer'), UserController.getProfile);
router.get('/profile/:id', checkLoggedIn('staff'), UserController.getProfile);



router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/orders', orderController.order);

router.get('/categories', categoryCtrl.index);
router.get('/categories/:id', categoryCtrl.searchById);
router.get('/categories/:id/products', categoryCtrl.catProducts);






module.exports = router;