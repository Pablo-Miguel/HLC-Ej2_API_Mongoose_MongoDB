const { ObjectId } = require('bson');
const express = require('express');
const Cart = require('../models/cart');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new express.Router();

router.post('/cart/addtocart/:id_course', auth, async (req, res) => {
    try {
        const id_course = req.params.id_course;
        const course = await Course.findById(id_course);
        
        if(!id_course || !course){
            throw new Error('No course Id selected!');
        }

        const cart = new Cart({
            ...req.body,
            user: req.user._id,
            course: course._id
        });
        
        await cart.save();

        res.send(cart);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/cart/mycart', auth, async (req, res) => {
    try {

        const carts = await Cart.find({ user: req.user._id });

        let new_carts = [];
        for(let i = 0; i < carts.length; i++){
            const user = await User.findById(req.user._id);
            const course = await Course.findById(carts[i].course);

            new_carts.push({
                ...carts[i],
                user: user,
                course: course
            });

        }

        res.send(new_carts);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;