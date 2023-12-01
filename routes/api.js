const { ChangeUserAuth, AuthRoles } = require('../middleware/Auth')

const express = require('express')
const UserController = require('../controllers/UserController')
const ProductController = require('../controllers/ProductController')
const OrderController = require('../controllers/OrderController')
const CategoryController = require('../controllers/CategoryController')
const PaymentController = require('../controllers/PaymentController')
const router = express.Router()


//UserController API Route
router.post('/register',UserController.registerUser)
router.post('/userLogin',UserController.loginUser)
router.post('/updatePassword/:id',ChangeUserAuth,UserController.updatePassword)
router.get('/logout',UserController.logout)
router.get('/me',ChangeUserAuth,UserController.getUserDetail)

//AdminOnly
router.get('/admin/users',UserController.getAllUser)
router.get('/admin/getUser/:id',UserController.getSingleUser)
router.delete('/admin/deleteUser/:id',UserController.deleteUser)
router.put('/admin/updateUserRole/:id',UserController.updateUserRole)
router.post('/admin/updateProfile/:id',UserController.updateProfile)

//ProductController
router.post('/product/create',ProductController.createProduct)
router.get('/products',ProductController.getAllProducts)
router.get('/getProductDetail/:id',ProductController.getProductDetail)
router.get('/product/getAdminProduct',ProductController.getAdminProduct)
router.post('/product/updateProduct',ProductController.updateProduct)
router.get('/product/deleteProduct/:id',ProductController.deleteProduct)

//OrderController
router.post('/order/create',OrderController.newOrder)
router.get('/order/getSingleOrder/:id',OrderController.getSingleOrder)
router.get('/order/myOrder',OrderController.myOrder)
router.get('/order/getAllOrders',OrderController.getAllOrders)
router.get('/order/deleteOrder/:id',OrderController.deleteOrder)


//CategoryController
router.post('/category/create',CategoryController.createCategory)
router.get('/categories',CategoryController.getAllCategories)
router.get('/getCategoriesDetail/:id',CategoryController.getCategoryDetail)


//payment
router.post('/payment/process',ChangeUserAuth,PaymentController.processPayment)
router.get('/stripeapiKey',ChangeUserAuth,PaymentController.sendStripeApiKey)










module.exports = router