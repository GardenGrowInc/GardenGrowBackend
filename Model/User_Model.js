const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileno: { type: String, required: true },
    password: { 
        type: String, 
        required: function() { return !this.token; }, // Make password optional if token is present
        validate: {
            validator: function(value) {
                return this.token ? true : !!value; // If token is present, password is not required
            },
            message: 'Password is required when token is not present.'
        }
    },
    confirmPassword: { 
        type: String, 
        required: function() { return !this.token; } // Make confirmPassword optional if token is present
    },
    token: { type: String } // Define token in the schema
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
