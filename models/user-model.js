const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product" // ✅ make sure lowercase 'product' matches your model
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],




    // isadmin: Boolean,
    orders: {
        type: Array,
        default: []
    },
    contact: Number,
    image: {
        type: Buffer,
        required: false
    },

})
module.exports = mongoose.model("user", userSchema);