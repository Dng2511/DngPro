const mongoose = require('../../common/database')();

const commentSchema = new mongoose.Schema({
    prd_id:{
        type: mongoose.Types.ObjectId,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    }
}, {timestamps: true});

const commentModel = mongoose.model("Comments", commentSchema ,"comments");
module.exports = commentModel;