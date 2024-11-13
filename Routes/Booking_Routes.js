const express = require('express');
const router = express.Router();
const { CreateBooking, GetBookings, GetBookingById, UpdateBooking, DeleteBooking } = require('../Controller/Booking_Controller');
const { jwtMiddleware } = require('../Middleware/jwt_Auth');

router.post('/createBookings', jwtMiddleware, CreateBooking);
router.get('/getBooking', GetBookings);
router.get('/getBooking/:id', GetBookingById);
router.put('/updateBooking/:id', UpdateBooking); // Add a PUT route for update
router.delete('/deleteBooking/:id', DeleteBooking); // Add a DELETE route for deleting

module.exports = router;
