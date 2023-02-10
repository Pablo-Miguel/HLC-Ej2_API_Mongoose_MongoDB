const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema('Course', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: Number,
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

courseSchema.method.toJSON = () => {
    const course = this;
    const courseObject = course.toObject();
    const cad_author = `${course.author.firstName} ${course.author.lastName}`;

    delete courseObject.author;

    courseObject.author = cad_author;

    return courseObject;
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;