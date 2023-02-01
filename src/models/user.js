const mongoose = require('mongoose');
const validator = require('validator');
const { phone } = require('phone');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    tel: {
        type: String,
        default: "+34644000000",
        validate(value) {
            if (!phone(value).isValid) {
                throw new Error('Telephone is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
});

module.exports = User;