const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    username: String,
    products: [{productName: String, quantity: Number}],
    total: Number,
    isPaid: Boolean,
    deliveryInformation: {
        country: String,
        city: String,
        address: String,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
