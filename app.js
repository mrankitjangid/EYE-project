const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const blogModel = require('./server/models/blogModel');
const dotenv = require('dotenv');
const fs = require('fs');
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

app.all('*', (req, res) => {
    res.render('page404');
});


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});