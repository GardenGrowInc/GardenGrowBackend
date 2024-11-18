const express = require('express');
const { createUser, loginUser, createUserWithToken } = require('../Controller/User_Controller');

const router = express.Router();

router.post('/createUser', createUser);
router.post('/createUserWithToken', createUserWithToken);
router.post('/loginUser', loginUser);

module.exports = router;
