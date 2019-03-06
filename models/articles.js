let mongoose = require('mongoose');


let articleSchema = mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    map: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    fees: {
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);