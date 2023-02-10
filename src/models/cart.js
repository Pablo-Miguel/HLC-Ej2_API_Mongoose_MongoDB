const mongoose = require("mongoose");

const Cart = mongoose.Model('Cart', {
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