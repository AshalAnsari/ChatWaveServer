const mongoose = require("mongoose");

const UserFriend = new mongoose.Schema({
    Friend: {
        type: String
    },
});

const FriendsSchema = new mongoose.Schema({
    User:{
        type: String,
    },
    UserFriends:{
        type: [UserFriend]

    }
});

const Friends = mongoose.model("Friends", FriendsSchema);

module.exports = Friends;