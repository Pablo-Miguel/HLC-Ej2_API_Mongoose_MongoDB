const express = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/courses/createcourse', auth, async (req, res) => {
    const course = new Course({
        ...req.body,
        author: req.user._id
    });

    try {
        await course.save();

        res.send(course);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/courses/allcourses', auth, async (req, res) => {
    try {
        const courses = await Course.find({});
        
        if (!courses) {
            return res.status(404).send()
        }

        res.send(courses);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/updatecourse/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'avg_note', 'user'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!course) {
            return res.status(404).send({ error: 'No course found!' });
        }

        res.send(course);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/deletecourse/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).send({ error: 'No course found!' });
        }

        res.send(course);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;