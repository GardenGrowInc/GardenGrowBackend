const express = require('express');
const app = express();
const mongoose = require('mongoose');
const productRoute = require('./Routes/Product_Routes');
const bookingRoute = require('./Routes/Booking_Routes');
const userRoute = require('./Routes/User_Routes');
const adminRoute = require('./Routes/Admin_Routes');
const cors = require('cors');
require('dotenv').config(); // Use dotenv for environment variables

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

// Use routes
app.use('/products', productRoute);
app.use('/booking', bookingRoute);
app.use('/user', userRoute);
app.use('/admin', adminRoute);

// Test route
app.get("/new", (req, res) => {
    res.send("Garden Grow");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI_GG)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(4000, () => {
            console.log(`Node API app is running on port 4000`);
            console.log(`http://localhost:4000`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

    