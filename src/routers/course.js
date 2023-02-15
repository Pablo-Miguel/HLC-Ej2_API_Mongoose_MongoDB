const express = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const User = require('../models/user');
const Cart = require('../models/cart');
const router = new express.Router();

router.post('/courses/createcourse', auth, async (req, res) => {
    const course = new Course({
        ...req.body,
        author: req.user._id
    });

    try {
        await course.save();

        const courseObject = await toObjectCourse(course);

        res.send(courseObject);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/courses/allcourses', auth, async (req, res) => {
    try {
        const carts = await Cart.find({user: req.user._id});
        let courses = await Course.find({author: {$ne: req.user._id}});

        let carts_courses_ids = [];
        carts.forEach((element) => {
            carts_courses_ids.push(element.course.toString());
        });
        
        let temp_courses = [];
        for(let i = 0; i < courses.length; i++){
            if(!carts_courses_ids.includes(courses[i]._id.toString())){
                const courseObject = await toObjectCourse(courses[i]);

                temp_courses.push(courseObject);
            }
        }

        if(temp_courses.length == 0) return res.status(404).send({ error: 'No courses for sale yet!' });

        res.send(temp_courses);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/courses/mycoursescart', auth, async (req, res) => {
    try {

        const carts = await Cart.find({ user: req.user._id });

        let temp_courses = [];
        for(let i = 0; i < carts.length; i++){
            const course = await Course.findById(carts[i].course);
            const courseObject = await toObjectCourse(course);

            temp_courses.push(courseObject);
        }

        if(temp_courses.length == 0) return res.status(404).send({ error: 'You has not buy any course yet!' });

        res.send(temp_courses);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/courses/mycoursesworkspace', auth, async (req, res) => {
    try {

        const courses = await Course.find({ author: req.user._id });

        let temp_courses = [];
        for(let i = 0; i < courses.length; i++){
            const courseObject = await toObjectCourse(courses[i]);

            temp_courses.push(courseObject);
        }

        if(temp_courses.length == 0) return res.status(404).send({ error: 'You has not create any course yet!' });

        res.send(temp_courses);
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
        const course = await Course.findById(req.params.id);

        if(!course) res.status(404).send({ error: 'Course not found!' });

        else if(course.author !== req.user._id) res.status(401).send({ error: 'You are not the owner of the course!' });

        updates.forEach(update => {
            course[update] = req.body[update];
        });

        await course.save();

        res.send(course);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/deletecourse/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if(!course) return res.status(404).send({ error: 'Course not found!' })

        else if(course.author !== req.user._id) return res.status(401).send({ error: 'You are not the owner of the course!' })
        
        course.delete();
        res.send(course);
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