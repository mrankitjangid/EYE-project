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

router.get('/', async (req, res) => {
    locals.title = "EYE Project | Next-Gen Cybersecurity Solutions";
    locals.description = "Protect your business from cyberattacks. EYE Project offers industry-leading cybersecurity solutions to safeguard your data and ensure business continuity. Learn more!";
    let dbResponse = await blogModel.find().sort({uploadId: 1});
    let recentBlogs = [];
    let posts = dbResponse.length;
    for( let i = 0; i < 6; i++ ) {
        try {
            let blog = {};
            blog.uploadId = dbResponse[posts - 1 - i]["uploadId"];
            blog.blogImg = dbResponse[posts - 1 - i]["blogImg"];
            blog.blogTitle = dbResponse[posts - 1 - i]["blogTitle"];
            blog.description = dbResponse[posts - 1 - i]['description'];
            blog.tags = dbResponse[posts - 1 - i]['tags'];
            recentBlogs.push(blog);
        } catch ( err ) {
            console.error('Error while getting recent blog from Database = ', err );
        }
    }
    let recommendedBlogs = [];
    for( let i = 0; i < 6; i++ ) {
        let curr_id = Math.floor(Math.random() * posts);
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
    res.render('index', {
        locals, 
        recentBlogs, 
        recommendedBlogs
    });
});

router.get('/blogs', async (req, res) => {
    locals.title = "EYE Project: Navigating the Digital Frontier";
    locals.description = "Welcome to EYE Project, your authoritative source for cutting-edge cybersecurity insights. Our blog is dedicated to providing you with the latest strategies, analysis, and trends to safeguard your digital assets. Join us as we explore the complexities of cyber defense and empower you with knowledge to fortify your cyber resilience.";
    let page = req.query.page || 1;
    let tags = await blogModel.distinct('tags');
    let ind = req.query.t;
    let key = req.query.key || '';
    if( typeof(ind) === 'string' ) {
        ind = [ind];
    };
    let filterTags = [];
    let filters = [];
    if( ind ) {
        ind.forEach( index => {
            filterTags.push([tags[index], index]);
            filters.push(tags[index]);
        });
    }
    let perPage = 8;
    let dbResponse;
    if( filterTags.length ) {
        dbResponse = await blogModel
            .aggregate([
                {
                    $match: {
                        $or: [
                            {blogTitle: {$regex: key}},
                            {textContent: {$regex: key}},
                            {description: {$regex: key}}
                        ]
                    },
                    $match: {tags: {$all: filters}}
                }, {
                    $sort: {uploadId: -1}
                }
            ]).skip((page - 1) * perPage)
            .limit(perPage)
            .exec();
    } else {
        dbResponse = await blogModel
        .aggregate([
            {
                $match: {
                    $or: [
                        {blogTitle: {$regex: key}},
                        {textContent: {$regex: key}},
                        {description: {$regex: key}}
                    ]
                }
            }, {
                $sort: {uploadId: -1}
            }
        ]).skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }
    let blogs = [];
    for( let i = 0; i < perPage && i < dbResponse.length; i++ ) {
        let blog = {};
        try {
            blog.uploadId = dbResponse[i]["uploadId"];
            blog.blogImg = dbResponse[i]["blogImg"];
            blog.blogTitle = dbResponse[i]["blogTitle"];
            blog.description = dbResponse[i]['description'];
            blogs.push(blog);
        } catch ( err ) {
            console.error('Error while getting document count = ', err );
        }
    }
    let url = req.url.toString();
    let curr_url = url;
    if( url.includes('page') ) {
        url = url.substring(0, url.length - 7)
    }
    if( !url.includes('?') )
        url += '?t=';
    else
        url += '&t=';
    let totalBlogs;
    if( filterTags.length ) {
        totalBlogs = await blogModel
            .aggregate([
                {
                    $match: {
                        $or: [
                            {blogTitle: {$regex: key}},
                            {textContent: {$regex: key}},
                            {description: {$regex: key}}
                        ]
                    },
                    $match: {tags: {$all: filters}}
                }, {
                    $sort: {uploadId: -1}
                }
            ]).exec();
    } else {
        totalBlogs = await blogModel
        .aggregate([
            {
                $match: {
                    $or: [
                        {blogTitle: {$regex: key}},
                        {textContent: {$regex: key}},
                        {description: {$regex: key}}
                    ]
                }
            }, {
                $sort: {uploadId: -1}
            }
        ]).exec();
    }
    totalBlogs = totalBlogs.length;
    let currPage = parseInt(page);
    let hasPrev = currPage > 1;
    let hasNext = currPage + 1 <= Math.ceil(totalBlogs / perPage);
    res.render('blogs', {
        locals, 
        blogs, 
        tags, 
        url, 
        filters: filterTags, 
        curr_url,
        hasPrev: hasPrev? true: null,
        currPage: currPage,
        hasNext: hasNext? true: null 
    });
});

router.get('/blog/:blogId', async (req, res) => {
    let dbResponse = await blogModel.find();
    let data = [];
    for ( let i = 0; i < 3; i++ ) {
        let curr_id = Math.floor(Math.random()* dbResponse.length);
        let dataItem = {};
        if ( dbResponse.length > curr_id ) {
            try {
                dataItem.uploadId = dbResponse[curr_id]['uploadId'];
                dataItem.blogTitle = dbResponse[curr_id]['blogTitle'];
                dataItem.blogImg = dbResponse[curr_id]['blogImg'];
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
        res.render('page404');
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
    res.render('blog', {
        blog, 
        locals, 
        data
    });
});

router.get('/workshop', (req, res) => {
    locals.title = "Level Up Your Cybersecurity Defenses: Workshops";
    locals.description = "Empower your team to defend against cyber threats with our interactive workshops. Learn from industry experts and gain the skills to protect your organization. Register today!"
    res.render('workshop', {locals});
});

router.get('/contact/:optionId?', (req, res) => {
    locals.title = "Secure Your Business | Contact Our Cybersecurity Experts";
    locals.description = "Need rock-solid cybersecurity solutions?  Connect with our expert team at [Your Company Name] today. Discuss your needs and get a free quote. We're here to safeguard your business.";
    res.render('contact', {optionId: req.params.optionId || 0, locals});
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

router.get('/privacy-policy', async (req, res) => {
    locals.title = "Privacy Commitment: Your Data, Secured";
    locals.description = "At EYE Project, we value your privacy as much as we do security. Our Privacy Policy outlines our unwavering commitment to protecting your personal information. Discover how we handle data with the utmost care, ensuring your privacy rights are respected and secured in the digital age."
    let dbResponse = await blogModel.find();
    let data = [];
    for ( let i = 0; i < 3; i++ ) {
        let curr_id = Math.floor(Math.random()* dbResponse.length);
        let dataItem = {};
        if ( dbResponse.length > curr_id ) {
            try {
                dataItem.uploadId = dbResponse[curr_id]['uploadId'];
                dataItem.blogTitle = dbResponse[curr_id]['blogTitle'];
                dataItem.blogImg = dbResponse[curr_id]['blogImg'];
                data.push(dataItem);
            } catch( err ) {
                console.error('Error while passing data to blog suggestion on sidebar:', err);
            };
        }
    }
    res.render('privacy-policy', {locals, data});
})

module.exports = router;