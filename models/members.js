const mongoose = require('mongoose');

const MemberSchema = mongoose.Schema({
    name1: {
        type: String,
        required: true
    },
    name2: {
        type: String,
        required: true
    },
    name3: {
        type: String,
        required: true
    },
    name4: {
        type: String,
        required: true
    }

    
});

const Members = module.exports = mongoose.model('Members', MemberSchema);