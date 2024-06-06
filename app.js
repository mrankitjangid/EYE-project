const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const blogModel = require('./server/models/blogModel');
const dotenv = require('dotenv');
dotenv.config({});

const app = express();


app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayout);

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


const PORT = process.env.PORT || 4444;


const dbConnect = require('./server/config/db');
dbConnect();

const latestUploadId = 10001;


const middleware = async (req, res, next) => {
    next();
}


app.use(middleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// const sendResponse = (res, respBody) => {
//     const headers = {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//     };
//     const response = {
//         statusCode: 200,
//         headers: headers,
//         body: respBody
//     };
//     res.send(response);
// }


app.use('/', require('./server/routes/main'));


app.get('/overview/:uploadId', async (req, res) => {
    // getting data from database
    let dbResponse = await blogModel.find({
        "uploadId": req.params.uploadId
    });
    if ( dbResponse.length === 0 ) {
        dbResponse = await blogModel.find({
            "uploadId": 10001
        });
    }
    dbResponse = dbResponse[0];
    let blog = [];
    blog.push(req.params.uploadId);
    try {
        blog.push(dbResponse["blogImg"]);
        blog.push(dbResponse["blogTitle"]);
        blog.push(dbResponse['description']);
        blog.push(dbResponse['tags']);
    } catch ( err ) {
        console.error('Error while getting overview from Database = ', err );
    }
    res.send(blog);
    // sendResponse(res, JSON.stringify(blog));
});


app.get('/latest-upload-id', async (req, res) => {
    let dbResponse = await blogModel.find();
    let response = dbResponse[dbResponse.length - 1]['uploadId'];
    // let response = dbResponse[dbResponse.length - 1]['upload-id'];
    res.send({id: response});
})

app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.sendFile(__dirname + '/views/sitemap.xml');
});


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});