const mongoose = require("mongoose");
const Users = require("../models/UserModel");
const Messages = require("../models/MessageModel");
const Friends = require("../models/FriendsModel");

const signup = async (req, res) => {
    console.log("siging in");
    const {username, email, password} = req.body;
    if(username && email && password){
        const isUserAvailableWithSameEmail = await Users.findOne({Email:email});
        if(isUserAvailableWithSameEmail != null){
            console.log("User ", isUserAvailableWithSameEmail);
            return res.status(400).json({message: "A user exist with this email. i.e Enter a unique email"});
        }
        
        const users = new Users({Username:username, Email:email, Password:password, SocketId:""});
        await users.save();
        return res.status(200).json({username: username, email:email, password: password});
    }
    else{
        return res.status(200).json({message: "Details are missing. i.e Username, Email, or Password is missing"});
    }

};

const login = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    try{
        if(email != null && password != null){
            const user = await Users.findOne({Email:email});
            console.log("User Doc: ", user);
            if(user != null){
                if(user.Password == password){
                    return res.status(200).json({User: user});
                }
                else{
                    return res.status(401).json({Message:"Incorrect Password"})
                }
            }
            else{
                return res.status(404).json({Message:"User not found by email: ", email});
            }
        }
        else{
            return res.status(401).json({Message: "Email or Password is missing"});
        }
    }
    catch(err){
        console.log("There has been an error while logging in. i.e", err);
        return res.status(404).json({Error: err});
    }
}

const connect = async (email, id) => {
    try{
        if(email && id){
            const user = await Users.findOne({Email:email});
            if(user != null){
                
                user.SocketId = id;
                await user.save();
                
                console.log("User connected ", user);
            }
            else{
                console.log("User not found");
            }
        }
    }catch(err){
        console.log("An error occured. i.e " + err)
    }
}

const disConnect = async (email) => {
    try{
        const user = await Users.findOne({Email: email});
        if(user){
            user.SocketId = "";
            await user.save();
            console.log("User Disconnected. i.e "+ email);
        }

    }catch(err){
        console.log("An error occured while disconnecting. i.e "+err);
    }
    
};

const socketDisconnect = async (socketId) => {
    try{
        const user = await Users.findOne({SocketId: socketId});
        if(user){
            user.SocketId = "";
            await user.save();
            console.log("User and Socket Disconnected. i.e " + user.Email);
        }

    }catch(err){
        console.log("An error occured while disconnecting. i.e "+err);
    }
    
};

const checkBeforeSendingMessage = async(recipient, message) => {
    try{
        if(message.length > 0){
            const user = await Users.findOne({Email:recipient});
            if(user != null){
                if(user.SocketId.length > 0){
                    return user.SocketId;
                }
                return 0;
            }
            return 2;
        }
    }catch(err){
        console.error("Error occurred while sending the message:", err);
        return 3;
    }
};

const addToPendingMessages = async (sender, recipient, message) => {
    try{
        const user = await Users.findOne({Email: recipient});

        if(user){
            const newPendingMessage = {
                Message:message, 
                TimeStamp: new Date(),
            }
            console.log(newPendingMessage, recipient);
    
            const pendingMessage = await Messages.findOne({Recipient: recipient});
            console.log(pendingMessage);
            if (pendingMessage != null) {
                // Update the existing document by pushing the new message
                
                const updatedMessage = await Messages.findOneAndUpdate(
                { Sender: sender, Recipient: recipient },
                { $push: { PendingMessages: newPendingMessage } },
                { new: true } // Return the updated document
                );
                updatedMessage.save();

            // console.log("Updated Pending Message:", updatedMessage);
            } else {

                const createMessage = new Messages({Sender: sender, Recipient: user.Email, PendingMessages:[newPendingMessage]})
                await createMessage.save();
                console.log("A new Pending Message " + createMessage);
            }
        }
    }catch(err){
        console.error("There was an error. i.e ", err);
    }
};

const checkForPendingMessages = async (email) => {
    try{
        if(email){

            const isThereAPendingMessage = await Messages.find({Recipient: email});
    
            if(isThereAPendingMessage.length > 0){
                return isThereAPendingMessage;
            }
        }
        return null;
    }catch(err){
        console.log("There was an error while checking for pending messages");
    }
}

const checkIfFriendExist = async (req, res) => {
    const email = req.body.email;
    try{
        const doesEmailExistInDB = await Users.findOne({Email: email});
    
        if(doesEmailExistInDB){
            return res.status(200).json({Message: 'This User Is Available On CHATWAVE', Email: email });
        }
        else{
            return res.status(400).json({Message: 'This User Is Not Available On CHATWAVE!', Email: email });
        }
    }
    catch(err){
        console.log("Error while adding friend i.e ", err);
    }
}

const addFriend = async (req, res) => {
    const {email, friend_email} = req.body;
    // console.log(email, friend_email);

    try{
        const user = await Friends.findOne({User: email});
        // console.log(user);

        if (user) {
            const friendExists = user.UserFriends.some(
                friend =>{
                    // console.log(friend);
                    friend.Friend === friend_email;
                }
                );
            // console.log(friendExists);
        
            if (friendExists) {
                return res.status(201).json({ Message: friend_email + ' Is Already In Your Friend List' });
            } 
            else {
                // console.log()
                user.UserFriends.push({ Friend: friend_email });
                await user.save();
        
                return res.status(200).json({ Message: friend_email + ' Added Successfully!' });
            }
        }
        else{
            const doesFriendExistOnCHATWAVE = await Users.findOne({Email: friend_email});
            // console.log(email + " " + friend_email);

            if(doesFriendExistOnCHATWAVE){

                const userFriends = await new Friends();
                userFriends.User = email;
                userFriends.UserFriends.push({Friend: friend_email});
                await userFriends.save();
    
                return res.status(200).json({Message: friend_email + " Added Successfully!"});
            }
            return res.status(404).json({Message:friend_email + " Is Not On ChatWave!"});
        }        
    }catch(err){
        console.log("Error: " + err);
    }
    
}

const fetchUserFriends = async(req, res) => {
    const email = req.body.email;

    try{
        const user = await Friends.findOne({User: email})
        // console.log("User", user);
        if(user){
            // console.log("response");
            return res.status(201).json({Friends: user.UserFriends});

        }
        return res.status(200).json({Message: "Add friends to talk with them"});
    }catch(err){
        return res.status(404).json({Message:"An error occured i.e ", Error: err})
    }
}

module.exports = {
    signup,
    login,
    connect,
    disConnect,
    checkBeforeSendingMessage,
    addToPendingMessages, 
    checkForPendingMessages,
    socketDisconnect,
    checkIfFriendExist,
    addFriend, 
    fetchUserFriends,
}