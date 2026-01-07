const express = require('express');
const router = express.Router();


// Controllers
const userController = require('../apps/controllers/user');
const productController = require('../apps/controllers/product');
const categoryCtrl = require('../apps/controllers/category');
const orderController = require('../apps/controllers/order');
const adminController = require('../apps/controllers/admin');
const mediaController = require('../apps/controllers/media');



// Middlewares
const checkLoggedIn = require('../apps/middlewares/checkLoggedIn');
const verifyToken = require('../apps/middlewares/verifyToken');
const upload = require('../apps/middlewares/upload');





router.get('/', (req, res) => {
    res.send("API is working");
});


router.post('/register/customer', userController.registerForCustomer);
router.post('/login/:role', userController.login);
router.post('/register/staff', checkLoggedIn('admin'), userController.registerForStaff);

// Profile routes
router.get('/profile', checkLoggedIn(), userController.getProfile);
router.put('/profile/email', checkLoggedIn(), userController.updateEmail);
router.put('/profile/phone', checkLoggedIn(), userController.updatePhone);
router.put('/profile/password', checkLoggedIn(), userController.updatePassword);
router.post('/profile/addresses', checkLoggedIn(), userController.addAddress);
router.put('/profile/addresses/:addressId', checkLoggedIn(), userController.updateAddress);
router.delete('/profile/addresses/:addressId', checkLoggedIn(), userController.deleteAddress);


//products
router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/products', checkLoggedIn('admin'), upload.single('thumbnail'), productController.create);
router.put('/products/:id', checkLoggedIn('admin'), upload.single('thumbnail'), productController.update);
router.delete('/products/:id', checkLoggedIn('admin'), productController.delete);

// Comment routes
router.get('/products/:id/comments', productController.getComments);
router.post('/products/:id/comments', checkLoggedIn(), productController.postComments);

// Orders
router.post('/orders', verifyToken, orderController.order);
router.post("/orders/get-payment-url", verifyToken,orderController.getPaymentUrl);
router.get('/orders/my', checkLoggedIn(), orderController.myOrders);
router.get('/orders', checkLoggedIn('admin'), orderController.allOrders);
router.put('/orders/:id', checkLoggedIn('admin'), orderController.updateStatus);
// VNPAY return callback (use server-side verification)
router.get('/vnpay/return', orderController.vnpayReturn);
router.get('/vnpay/status', orderController.vnpayStatus);


//Categories
router.get('/categories', categoryCtrl.index);
router.get('/categories/:id', categoryCtrl.searchById);
router.get('/categories/:id/products', categoryCtrl.catProducts);
router.post('/categories', checkLoggedIn('admin'), categoryCtrl.create);
router.put('/categories/:id', checkLoggedIn('admin'), categoryCtrl.update);
router.delete('/categories/:id', checkLoggedIn('admin'), categoryCtrl.delete);

//Cart
router.get('/cart', checkLoggedIn(), userController.getCart);
router.put('/cart', checkLoggedIn(), userController.updateCart);
router.delete('/cart/:id', checkLoggedIn(), userController.deleteCart);

//Admin management
router.get('/dashboard', checkLoggedIn('admin'), adminController.dashboard);
router.get('/users', checkLoggedIn('admin'), userController.index);
router.put('/users/:id/ban', checkLoggedIn('admin'), userController.setBanStatus);
router.get('/images/products/:filename', mediaController.getPrdImage);

module.exports = router;