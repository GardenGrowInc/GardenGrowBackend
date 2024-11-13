const express = require('express');
const { createUser, loginUser } = require('../Controller/User_Controller');

const router = express.Router();

router.post('/createUser', createUser);
router.post('/loginUser', loginUser);

module.exports = router;
