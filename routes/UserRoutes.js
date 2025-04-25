const express = require("express")
const { signup, checkIfFriendExist, addFriend, fetchUserFriends, login } = require("../controllers/userControllers")

const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/check_friend', checkIfFriendExist);
router.post('/add_friend', addFriend);
router.post('/get_friends', fetchUserFriends);

// router.post('/pendingmessage', checkForPendingMessages);



module.exports = router;