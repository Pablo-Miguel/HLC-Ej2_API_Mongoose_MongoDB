const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const User = require('./user');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "This course doesn't have description",
        trim: true
    },
    cre8_date: {
        type: Date,
        default: new Date()
    },
    price: {
        type: Number,
        default: 0.00
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;