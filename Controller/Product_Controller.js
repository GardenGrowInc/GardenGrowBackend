const Product = require('../Model/Product_Model');
const cloudinary = require("../cloudinary");
const fs = require("fs");

// Create product
exports.createProducts = async (req, res) => {
    try {
        const { pname, pdesc, USD, CAD, quantity } = req.body;

        // Validate required fields
        if (!pname || !pdesc || !USD || !CAD || !quantity) {
            return res.status(400).json({
                error: "All fields (pname, pdesc, USD, CAD, quantity) are required",
            });
        }

        // Validate us_price and canada_price as numbers
        if (isNaN(USD) || isNaN(CAD) || isNaN(quantity)) {
            return res.status(400).json({
                error: "USD price, CAD price and quantity must be valid numbers",
            });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: `File not found: ${filePath}` });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(filePath);

        // Delete the file from the local server after upload
        fs.unlinkSync(filePath);

        // Create the product
        const product = await Product.create({
            pname,
            pdesc,
            USD: `$${parseFloat(USD).toFixed(2)}`,
            CAD: `C$${parseFloat(CAD).toFixed(2)}`,
            quantity: parseInt(quantity),
            image: result.secure_url, // Save Cloudinary URL
        });

        res.status(201).json({
            message: "Product created successfully with image",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({
            error: "Error creating product",
            details: error.message,
        });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const total = products.length;

        res.status(200).json({
            Total_Products: total,
            products: products.map(product => ({
                ...product.toObject(),
                CAD: product.CAD ? `C$${parseFloat(product.CAD.replace(/[^0-9.-]+/g,"")).toFixed(2)}` : "C$0.00" // Ensure CAD is parsed correctly
            }))
        });
    } catch (error) {
        console.error("Error getting product details:", error.message);
        res.status(500).send("Error getting product details");
    }
};

// Get product by id 
exports.findProductById = async (req, res) => {
    try {
        const { id } = req.params; 
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: `Product not found with id: ${id}` });
        }
        
        res.status(200).json({
            ...product.toObject(),
            CAD: product.CAD ? `C$${parseFloat(product.CAD.replace(/[^0-9.-]+/g,"")).toFixed(2)}` : "C$0.00"
        });
    } catch (error) {
        console.error("Error finding product by ID:", error.message);
        res.status(500).json({
            error: "Error finding product",
            details: error.message,
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    console.log(req.body); // Log the incoming form data
    console.log(req.file); // Log the uploaded file if any

    try {
        const { id } = req.params;
        const { pname, pdesc, USD, CAD, quantity } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: `Product not found with id: ${id}` });
        }

        let uploadedUrl = product.image;

        // If a new image file is uploaded, upload to Cloudinary and update the URL
        if (req.file) {
            const filePath = req.file.path;

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: `File not found: ${filePath}` });
            }

            const result = await cloudinary.uploader.upload(filePath);
            uploadedUrl = result.secure_url;

            // Remove file from server after upload
            fs.unlinkSync(filePath);
        }

        // Ensure USD and CAD are valid numbers, default to existing values if not
        let formattedUSD = product.USD;
        if (USD && !isNaN(parseFloat(USD))) {
            formattedUSD = `$${parseFloat(USD).toFixed(2)}`; // Format USD if valid
        }

        let formattedCAD = product.CAD;
        if (CAD && !isNaN(parseFloat(CAD))) {
            formattedCAD = `C$${parseFloat(CAD).toFixed(2)}`; // Format CAD if valid
        }

        // Update the product with new values from req.body, or keep the old values if not provided
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                pname: pname || product.pname, // Use new pname if provided
                pdesc: pdesc || product.pdesc, // Use new pdesc if provided
                USD: formattedUSD, // Use formatted USD or old value
                CAD: formattedCAD, // Use formatted CAD or old value
                quantity: quantity ? parseInt(quantity) : product.quantity, // Use new quantity or keep old
                image: uploadedUrl, // Use new image URL if uploaded, else keep old
            },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: "Product updated successfully",
            Product: updatedProduct, // Return the updated product directly
        });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({
            error: "Product update failed",
            details: error.message,
        });
    }
};



// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: `Product not found with id: ${id}` });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct, 
        });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({
            error: "Error deleting product",
            details: error.message,
        });
    }
};

exports.deleteAllProducts = async(req,res)=>{
    const deletedproducts = await Product.deleteMany();
    res.status(200).json({
        message:"All products deleted successfully",
        deletedproducts,
    });
}
  
  