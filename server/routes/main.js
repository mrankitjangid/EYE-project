const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dbConnect = require('../config/db');
const blogModel = require('../models/blogModel');
const contactModel = require('../models/contactModel');


let locals = {
    title: "",
    description: ""
};


dbConnect();

const latestUploadId = 10006;


const middleware = async (req, res, next) => {
    // blog = await dbConnect();
    next();
}

router.use(middleware);


router.get('/', async (req, res) => {
    locals.title = "EYE Project | Next-Gen Cybersecurity Solutions";
    locals.description = "Protect your business from cyberattacks. EYE Project offers industry-leading cybersecurity solutions to safeguard your data and ensure business continuity. Learn more!";
    let dbResponse = await blogModel.find();
    let recentBlogs = [];
    for( let i = 0; i < 6; i++ ) {
        try {
            let blog = {};
            blog.uploadId = dbResponse[i]["uploadId"];
            blog.blogImg = dbResponse[i]["blogImg"];
            blog.blogTitle = dbResponse[i]["blogTitle"];
            blog.description = dbResponse[i]['description'];
            blog.tags = dbResponse[i]['tags'];
            recentBlogs.push(blog);
        } catch ( err ) {
            console.error('Error while getting recent blog from Database = ', err );
        }
    }
    let recommendedBlogs = [];
    for( let i = 0; i < 6; i++ ) {
        let curr_id = Math.floor(Math.random() * dbResponse.length);
        try {
            let blog = {};
            blog.uploadId = dbResponse[curr_id]["uploadId"];
            blog.blogImg = dbResponse[curr_id]["blogImg"];
            blog.blogTitle = dbResponse[curr_id]["blogTitle"];
            blog.description = dbResponse[curr_id]['description'];
            blog.tags = dbResponse[curr_id]['tags'];
            recommendedBlogs.push(blog);
        } catch ( err ) {
            console.error('Error while getting recommended blogs from Database = ', err );
        }
    }
    res.render('index', {locals, recentBlogs, recommendedBlogs});
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
        blog.blogImg = dbResponse['blogImg'];
        blog.textContent = dbResponse['textContent'];
        blog.tags = dbResponse['tags'];
        locals.title = blog.blogTitle;
        locals.description = dbResponse['description'];
    } catch( err ) {
        console.log('An unexpected error occured', err);
    }
    res.render('blog', {blog, locals, data});
});

router.get('/workshop', (req, res) => {
    locals.title = "Level Up Your Cybersecurity Defenses: Workshops";
    locals.description = "Empower your team to defend against cyber threats with our interactive workshops. Learn from industry experts and gain the skills to protect your organization. Register today!"
    res.render('workshop', {locals});
});

router.get('/contact', (req, res) => {
    locals.title = "Secure Your Business | Contact Our Cybersecurity Experts";
    locals.description = "Need rock-solid cybersecurity solutions?  Connect with our expert team at [Your Company Name] today. Discuss your needs and get a free quote. We're here to safeguard your business.";
    res.render('contact', {optionId: 0, locals});
});

router.get('/contact/:optionId?', (req, res) => {
    locals.title = "Secure Your Business | Contact Our Cybersecurity Experts";
    locals.description = "Need rock-solid cybersecurity solutions?  Connect with our expert team at [Your Company Name] today. Discuss your needs and get a free quote. We're here to safeguard your business.";
    res.render('contact', {optionId: req.params.optionId, locals});
});

router.get('/services', (req, res) => {
    locals.title = "EYE Project | Get Answers & Explore Our Cybersecurity Services";
    locals.description = " Struggling with cybersecurity? We offer comprehensive solutions & answer your FAQs. Get expert protection, threat detection, & support for all your needs. Visit Now!";
    res.render('services', {locals});
});

router.post('/contact/thanks', async (req, res) => {
    try {
        await contactModel.insertMany([req.body]);
    } catch(err) {
        console.error('Could not store contact information\n', err);
    }
    locals.title = "Thanks for Reaching Out! | EYE Project";
    locals.description = "We received your message! Our cybersecurity team will be in touch shortly to discuss your needs. Stay safe in the meantime with our free resources!";
    res.render('contact', {optionId: 0, locals});
});

router.get('/about', async (req, res) => {
    locals.title = "Protecting Your Data: About EYE Project";
    locals.description = "Learn about EYE Project, a leading cybersecurity startup dedicated to safeguarding businesses and individuals in Jaipur and across India. We offer innovative solutions to combat today's cyber threats."
    res.render('about', {locals});
});

router.all('*', (req, res) => {
    res.render('page404');
});

module.exports = router;