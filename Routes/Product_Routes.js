const express = require('express');
const router = express.Router();
const { createProducts, getProducts, updateProduct, deleteProduct, findProductById, deleteAllProducts } = require('../Controller/Product_Controller');
const upload = require('../Middleware/multer')

// Create a new product
router.post('/createProduct',upload.single('image'), createProducts);

// Get all products
router.get('/getProduct', getProducts);

//get product by id
router.get('/getProductById/:id', findProductById);

//update product
router.put('/updateProduct/:id',upload.single('image'), updateProduct);

//update product
router.delete('/deleteProduct/:id', deleteProduct);

//delete all products
router.delete('/deleteAll',deleteAllProducts);

module.exports = router;