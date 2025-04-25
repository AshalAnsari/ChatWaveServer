const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Username:{
        type: String, 
        required: true,
    }, 
    Email:{
        type:String, 
        required:true,
        unique: true
    },
    Password:{
        type: String,
        required:true
    },
    SocketId:{
        type:String, 
    },
    Status:{
        type:String,
        default:"Not-Verified"
    }
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;