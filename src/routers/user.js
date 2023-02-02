const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/createuser', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/searchuser/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        
        if (!user) {
            return res.status(404).send({ error: 'No user found!' });
        }

        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/updateuser/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'tel', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send({ error: 'No user found!' });
        }

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send({ error: 'No user found!' });
        }

        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;