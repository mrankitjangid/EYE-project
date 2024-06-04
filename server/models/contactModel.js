const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        require: false
    },
    subject: {
        type: Number,
        require: false
    },
    message: {
        type: String,
        require: true
    },
    createdAt: {
        type: String,
        default: () => Date().toString()
    }
});

module.exports = mongoose.model('contacts', contactSchema);