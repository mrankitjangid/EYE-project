const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema ({
    uploadId: Number,
    blogTitle: String,
    postedOn: String,
    author: String,
    blogThumbnail: String,
    blogImg: String,
    description: String,
    textContent: String,
    tags: Array,
});

module.exports = mongoose.model('blogs', blogSchema);