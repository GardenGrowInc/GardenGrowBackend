const User = require('../Model/User_Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
require('dotenv').config()

exports.createUser = async (req, res) => {
    const { email, firstName, lastName, mobileno, password, confirmPassword, token } = req.body;

    console.log("Request Body:", req.body); // Log the request body

    try {
        // Check if token is present
        if (token) {
            console.log("Token is present");
            // Validate only email and name
            if (!email || !firstName || !lastName) {
                return res.status(400).json({
                    message: 'Error creating user',
                    error: 'Email and name are required when token is present.'
                });
            }
        } else {
            console.log("Token is not present");
            // Validate email and password
            if (!email || !password || !confirmPassword || !mobileno) {
                return res.status(400).json({
                    message: 'Error creating user',
                    error: 'Email, password, confirmPassword, and mobileno are required when token is not present.'
                });
            }
        }

        // Additional validation for password and confirmPassword
        if (!token && password !== confirmPassword) {
            return res.status(400).json({
                message: 'Error creating user',
                error: 'Password and confirm password must match.'
            });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Error creating user',
                error: 'User with this email already exists.'
            });
        }

        const newUser = new User({
            email,
            firstName,
            lastName,
            mobileno,
            password: token ? undefined : password, // Only set password if token is not present
            confirmPassword: token ? undefined : confirmPassword, // Only set confirmPassword if token is not present
            token // Ensure token is included
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        return res.status(201).json({ message: 'User created successfully', user: savedUser });

    } catch (err) {
        return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found:", email); // Log user not found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Password mismatch for user:", email); // Log password mismatch
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log(user,"User logged in");

        // Generate JWT token
        const JwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' }); // Changed expiration to 1 month

        // Successful login
        return res.status(200).json({ message: 'Login successful', user: user, jwtToken: JwtToken }); // Include token in response
        
    } catch (err) {
        console.error("Error logging in:", err.message); // Log error message
        return res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
