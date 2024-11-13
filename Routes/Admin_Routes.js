const express = require('express')
const router = express.Router()
const {adminJwtMiddleware} = require('../Middleware/jwt_Auth')
const{CreateAdmin, LoginAdmin} = require('../Controller/Admin_Controller')

router.post('/createAdmin', CreateAdmin)
router.post('/loginAdmin', adminJwtMiddleware, LoginAdmin);


module.exports = router

