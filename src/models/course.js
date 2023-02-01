const mongoose = require('mongoose');

const Course = mongoose.model('Course', {
    name: {
        type: String,
        required: true
    },
    avg_note: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0 || value > 10) {
                throw new Error('Avg note must be between 0 and 10')
            }
        }
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
});

module.exports = Course;