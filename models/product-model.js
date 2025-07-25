const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: {
        type: Buffer,
        default: "/public/images/uploads/default.jpg"
    },
    name: String,
    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    sort: {
        type: Number,
        default: 0
    }

})
module.exports = mongoose.model("Product", productSchema);
