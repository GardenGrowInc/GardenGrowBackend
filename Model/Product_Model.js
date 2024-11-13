const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname: { type: String, required: true },
    pdesc: { type: String, required: true },
    USD: { type: String, required: true },
    CAD:{type:String,required:true},
    quantity: { type: Number, required: true },
    image: { type: String }  // Assuming image is a URL or path
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
