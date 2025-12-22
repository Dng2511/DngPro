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

// Profile routes
router.get('/profile', checkLoggedIn(), UserController.getProfile);
router.put('/profile/email', checkLoggedIn(), UserController.updateEmail);
router.put('/profile/phone', checkLoggedIn(), UserController.updatePhone);
router.put('/profile/password', checkLoggedIn(), UserController.updatePassword);
router.post('/profile/addresses', checkLoggedIn(), UserController.addAddress);
router.put('/profile/addresses/:addressId', checkLoggedIn(), UserController.updateAddress);
router.delete('/profile/addresses/:addressId', checkLoggedIn(), UserController.deleteAddress);

router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/orders', orderController.order);

router.get('/categories', categoryCtrl.index);
router.get('/categories/:id', categoryCtrl.searchById);
router.get('/categories/:id/products', categoryCtrl.catProducts);

router.post('/create-payment', orderController.payment);




module.exports = router;