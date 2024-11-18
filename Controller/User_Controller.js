const User = require('../Model/User_Model');
const UserWithToken = require('../Model/User_Model_With_Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
require('dotenv').config()

exports.createUser = async (req, res) => {
    const { email, firstName, lastName, mobileno, password, confirmPassword } = req.body;

    console.log("Request Body:", req.body); // Log the request body

    try {
        // Validate email and password
        if (!email || !password || !confirmPassword || !mobileno) {
            return res.status(400).json({
                message: 'Error creating user',
                error: 'Email, password, confirmPassword, and mobileno are required.'
            });
        }

        // Additional validation for password and confirmPassword
        if (password !== confirmPassword) {
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

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const newUser = new User({
            email,
            firstName,
            lastName,
            mobileno,
            password: hashedPassword, // Set password
            confirmPassword: hashedPassword // Set confirmPassword
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log(savedUser,"User created ");
        return res.status(201).json({ message: 'User created successfully', user: savedUser });

    } catch (err) {
        return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

exports.createUserWithToken = async (req, res) => {
    const { email, name, token } = req.body;
    const jwtWithToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const userWithToken = new UserWithToken({ email, name});
    await userWithToken.save();
    return res.status(201).json({ message: 'User created with token', user: userWithToken, accessToken: jwtWithToken });
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
