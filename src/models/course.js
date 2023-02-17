const mongoose = require('mongoose');
const Cart = require('./cart');

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

courseSchema.methods.toJSON = function () {
    const course = this;
    const courseObject = course.toObject();
    const author = courseObject.author;

    delete courseObject.author;
    courseObject.author = `${author.firstName} ${author.lastName}`;

    return courseObject;
};

courseSchema.pre('remove', async function (next) {
    const course = this;
    await Cart.deleteMany({ course: course._id });
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;