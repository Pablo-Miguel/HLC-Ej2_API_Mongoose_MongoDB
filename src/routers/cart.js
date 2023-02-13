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

        let temp_carts = [];
        for(let i = 0; i < carts.length; i++){
            const course = await Course.findById(carts[i].course);
            const cartObject = carts[i].toObject();
            delete cartObject.user;
            delete cartObject.course;
            cartObject.user = req.user;
            
            const courseObject = await toObjectCourse(course);

            cartObject.course = courseObject;

            temp_carts.push(cartObject);
        }

        if(temp_carts.length == 0) res.status(404).send({ status: 'Your cart is empty!' });

        res.send(temp_carts);
    } catch (e) {
        res.status(500).send(e);
    }
});

async function toObjectCourse(course){
    const user = await User.findById(course.author);
    const courseObject = course.toObject();
    delete courseObject.author;
    courseObject.author = `${user.firstName} ${user.lastName}`;

    return courseObject;
}

module.exports = router;