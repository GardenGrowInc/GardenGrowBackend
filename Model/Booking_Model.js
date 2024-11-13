const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    pId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    pname: { type: String, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    billingAddress: { 
        firstname:{type:String,required:true},
        lastname:{type:String,required:true},
        mobileno:{type:String,required:true},
        address:{type:String,required:true},
        country:{type:String,required:true},
        state:{type:String,required:true},
        city:{type:String,required:true},
        zipcode:{type:String,required:true}
     },
     shippingAddress:{
        firstname:{type:String,required:false},
        lastname:{type:String,required:false},
        mobileno:{type:String,required:false},
        address:{type:String,required:false},
        country:{type:String,required:false},
        state:{type:String,required:false},
        city:{type:String,required:false},
        zipcode:{type:String,required:false}
     }
});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking; 
