const mongoose = require("mongoose");

const PendingMessageScheme = new mongoose.Schema({
    Message:{
        type: String,
        required: true
    },
    TimeStamp:{
        type: Date,
        required: true
    }
});

const MessageSchema = new mongoose.Schema({
    Sender:{
        type:String,
        required: true,
    },
    Recipient:{
        type:String, 
        required:true
    },
    PendingMessages:[PendingMessageScheme,]
});

const Messages = mongoose.model('Message', MessageSchema);

module.exports = Messages;