const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dbConnect = require('../config/db');
const blogModel = require('../models/blogModel');
const contactModel = require('../models/contactModel');


let locals = {
    title: "EYE Project - Home",
    description: "Simple blog website created by Ankit Jangid"
};


dbConnect();

const latestUploadId = 10006;


const middleware = async (req, res, next) => {
    // blog = await dbConnect();
    next();
}

router.use(middleware);


router.get('/', (req, res) => {
    res.render('index', {locals});
});

router.get('/blog', (req, res) => {
    res.redirect('/');
});

router.get('/blog/:blogId', async (req, res) => {
    let dbResponse = await blogModel.find();
    let data = [];
    for ( let i = 0; i < 3; i++ ) {
        let curr_id = Math.floor(Math.random()* (latestUploadId - 10000));
        let dataItem = {};
        if ( dbResponse.length > curr_id ) {
            try {
                dataItem.uploadId = dbResponse[curr_id]['uploadId'];
                dataItem.blogTitle = dbResponse[curr_id]['blogTitle'];
                dataItem.blogThumbnail = dbResponse[curr_id]['blogThumbnail'];
                data.push(dataItem);
            } catch( err ) {
                console.error('Error while passing data to blog suggestion on sidebar:', err);
            };
        }
    }
    dbResponse = await blogModel.find({
        'uploadId': req.params.blogId
    });
    if ( dbResponse.length === 0 ) {
        dbResponse = await blogModel.find({
            'uploadId': 10001
        });
    }
    dbResponse = dbResponse[0];
    let blog = {};
    try {
        blog.uploadId = dbResponse['uploadId'];
        blog.blogTitle = dbResponse['blogTitle'];
        blog.postedOn = dbResponse['postedOn'];
        blog.author = dbResponse['author'];
        blog.thumbnail = dbResponse['blogThumbnail'];
        blog.blogImg = dbResponse['blogImg'];
        blog.textContent = dbResponse['textContent'];
        blog.tags = dbResponse['tags'];
        locals.title = blog.blogTitle;
    } catch( err ) {
        console.log('An unexpected error occured', err);
    }

    // res.send(blog);
    res.render('blog', {blog, locals, data});
});

router.get('/blogdetails', (req, res)=>{
    res.render('blogdetails');
});

router.get('/workshop', (req, res) => {
    res.render('workshop');
});

router.get('/contact/:optionId?', (req, res) => {
    res.render('contact', {optionId: req.params.optionId});
});

router.get('/services', (req, res) => {
    res.render('services');
});

router.post('/contact/thanks', async (req, res) => {
    console.log(req.body);
    try {
        await contactModel.insertMany([req.body]);
    } catch(err) {
        console.error('Could not store contact information\n', err);
    }
    res.render('contact', {optionId: 0, locals});
});

router.get('/about', async (req, res) => {
    res.render('about');
})

module.exports = router;