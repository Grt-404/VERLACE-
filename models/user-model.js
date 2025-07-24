const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
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