const Booking = require('../Model/Booking_Model');
const Product = require('../Model/Product_Model');

exports.CreateBooking = async (req, res) => {
    try {
        console.log("booking:", req.body);
        const { pId, pname, price, totalPrice, quantity, billingAddress, shippingAddress } = req.body;

        // Validate the request body
        if (!pId || !pname || !price || !totalPrice || !quantity || 
            !billingAddress || !billingAddress.firstname || 
            !billingAddress.lastname || !billingAddress.mobileno || 
            !billingAddress.address || !billingAddress.country || 
            !billingAddress.state || !billingAddress.city || 
            !billingAddress.zipcode) {
            
            const missingFields = [];
            if (!pId) missingFields.push('pId');
            if (!pname) missingFields.push('pname');
            if (!price) missingFields.push('price');
            if (!totalPrice) missingFields.push('totalPrice');
            if (!quantity) missingFields.push('quantity');
            if (!billingAddress) {
                missingFields.push('billingAddress');
            } else {
                if (!billingAddress.firstname) missingFields.push('firstname');
                if (!billingAddress.lastname) missingFields.push('lastname');
                if (!billingAddress.mobileno) missingFields.push('mobileno');
                if (!billingAddress.address) missingFields.push('address');
                if (!billingAddress.country) missingFields.push('country');
                if (!billingAddress.state) missingFields.push('state');
                if (!billingAddress.city) missingFields.push('city');
                if (!billingAddress.zipcode) missingFields.push('zipcode');
            }

            console.error("Missing fields when creating booking:", missingFields); // Log missing fields
            return res.status(400).json({
                message: 'Error creating booking',
                error: 'All required fields must be provided: ' + missingFields.join(', ')
            });
        }

        // Check if the product exists
        const product = await Product.findById(pId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found with id: ' + pId });
        }

        // Create a new booking instance
        const newBooking = await Booking.create({
            pId,
            pname,
            price,
            totalPrice,
            quantity,
            billingAddress,
            shippingAddress
        });

        // Save the booking to the database
        // const savedBooking = await newBooking.save();

        // Return success response
        res.status(201).json({success:true,message:"Booking created successfully",newBooking});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.GetBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('pId', 'pname price');
        
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        const totalBookings = bookings.length; // Count the total number of bookings

        res.status(200).json({ totalBookings, bookings }); // Include totalBookings in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.GetBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id).populate('pId', 'pname price');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.UpdateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the incoming data
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No data provided for update' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true }).populate('pId', 'pname price');

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.DeleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
