const express = require('express');
const Course = require('../models/course');
const router = new express.Router();

router.post('/createcourse', async (req, res) => {
    const course = new Course(req.body);

    try {
        await course.save();
        res.status(201).send(course);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/searchcourse/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const course = await Course.findById(_id);
        
        if (!course) {
            return res.status(404).send({ error: 'No course found!' });
        }

        res.status(200).send(course);
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