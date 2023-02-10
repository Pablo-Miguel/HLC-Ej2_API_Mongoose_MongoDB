const mongoose = require("mongoose");

const Cart = mongoose.model('Cart', {
    paid: {
        type: Number,
        default: 0.00
    },
    date: {
        type: Date,
        default: new Date()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }
});

module.exports = Cart;