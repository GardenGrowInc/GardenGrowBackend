const Admin = require('../Model/Admin_Model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.CreateAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the admin with the hashed password
        const admin = await Admin.create({ username, password: hashedPassword });

        // Generate JWT token upon creation
        const token = jwt.sign({ username: admin.username, id: admin._id }, 'GardenGrowAdmin', { expiresIn: '30d' });

        res.status(201).json({ admin, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.LoginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("username, password", username, password);

        // Find the admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Login successful after token is validated and credentials are correct
        res.status(200).json({ message: 'Login successful', admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
