const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema ({
    uploadId: {
        type: Number,
        require: true
    },
    blogTitle: {
        type: String,
        require: true
    },
    postedOn: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    blogThumbnail: {
        type: String,
        require: true
    },
    blogImg: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    textContent: {
        type: String,
        require: true
    },
    tags: {
        type: Array,
        require: false
    }
});

module.exports = mongoose.model('blogs', blogSchema);