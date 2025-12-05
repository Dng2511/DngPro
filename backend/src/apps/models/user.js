const mongoose = require('../../common/database')();


const userSchema = new mongoose.Schema({
    emails:{
        type: [String],
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        require: true,
    },
    full_name:{
        type: String,
        default: null,
    }
});
const usersModel = mongoose.model("Users", userSchema, "users");
module.exports = usersModel;