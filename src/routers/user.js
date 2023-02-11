const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch(e) {
        res.status(400).send();
    }
});

router.get('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send({ status: 'You have just logged out of the page' });
    } catch(e) {
        res.status(500).send();
    }
});

router.get('/users/howami', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/updateme', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach(update => {
            req.user[update] = req.body[update];
        });

        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/deleteme', auth, async (req, res) => {
    try {
        await req.user.delete();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;