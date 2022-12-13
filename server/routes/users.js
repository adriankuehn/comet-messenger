const router = require("express").Router();
const User = require("../models/user");
const NameTable = require("../models/nametable");
const Conversation = require("../models/conversation");
const bcrypt = require("bcrypt");

// Server only releases private information when secret user_id (=key) is provided
// Otherwise, only public information is released if the userName is provided

//update user profile picture
router.post("/profile_pic", async (req, res) => {
  const { user_id, selectedFile } = req.body;
  try {
    const user = await User.findById(user_id);
    if (user) {
      const updated_user = await User.findOneAndUpdate({ _id: user_id }, { $set: { profilePicture: selectedFile } });
      res.status(200).send({ data: updated_user, message: "Profile picture updated" });
    } else {
      console.log("User ID does not exist");
      res.status(400).json("User ID does not exist");
    }
  } catch (err) {
    console.log("SERVER ERROR: " + err);
    return res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user - only for own profile, secret user._id required
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a other user - for other profiles (friends), public user name required
router.get("/friend/:userName", async (req, res) => {
  try {
    const friend = await User.findOne({ userName: req.params.userName });
    const { password, updatedAt, email, ...other } = friend._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all user names for search bar
router.get("/allUserNames/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const table_result = await NameTable.find({});
      //console.log("table_result.userNames: " + table_result[0].userNames);
      res.status(200).json(table_result[0].userNames);
    } else {
      res.status(401);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/request", async (req, res) => {
  const { userId, requestedUserName } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      const user_requested = await User.findOne({ userName: requestedUserName });

      if (user_requested.friendsToAccept.includes(user.userName) && user.friendsPending.includes(requestedUserName) || user.friends.includes(requestedUserName)) {
        res.status(403).json("Already requested connection to this user");
      } else {
        await User.findOneAndUpdate({ userName: requestedUserName }, { $push: { friendsToAccept: user.userName } });
        const updated_user = await User.findOneAndUpdate({ _id: userId }, { $push: { friendsPending: requestedUserName } });
        //console.log("updated_user: " + updated_user);
        res.status(200).send({ data: updated_user, message: "Friend connection request successful" });
      }
    } else {
      console.log("User ID does not exist");
      res.status(401).json("User ID does not exist");
    }
  } catch (err) {
    console.log("SERVER ERROR: " + err);
    return res.status(500).json(err);
  }
});

router.get("/openrequests/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const response = { friendsPending: user.friendsPending, friendsToAccept: user.friendsToAccept, friends: user.friends};
      res.status(200).send({ data: response, message: "Friend connection request successful" });
    } else {
      console.log("User ID does not exist");
      res.status(401).json("User ID does not exist");
    }
  } catch (err) {
    console.log("SERVER ERROR: " + err);
    return res.status(500).json(err);
  }
});

router.post("/acceptRequest", async (req, res) => {
  const { userId, requestedUserName } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      if (!user.friends.includes(requestedUserName)) {
        const user_requested = await User.findOne({ userName: requestedUserName });

        await user.updateOne({ $pull: { friendsToAccept: requestedUserName } });
        await user_requested.updateOne({ $pull: { friendsPending: user.userName } });

        const newConversation = new Conversation({
          members: [user.userName, requestedUserName],
        });
        const savedConversation = await newConversation.save();
        await user.updateOne({ $push: { conversations: savedConversation._id } });
        await user.updateOne({ $push: { friends: requestedUserName } });
        await user_requested.updateOne({ $push: { conversations: savedConversation._id } });
        await user_requested.updateOne({ $push: { friends: user.userName } });
        console.log("Friend connection request accepted");
        res.status(200).json(savedConversation);
      } else {
        res.status(400).json("Both users are already connected");
      }
    } else {
      console.log("User ID does not exist");
      res.status(401).json("User ID does not exist");
    }
  } catch (err) {
    console.log("SERVER ERROR: " + err);
    return res.status(500).json(err);
  }
});

router.post("/withdrawRequest", async (req, res) => {
  const { userId, requestedUserName } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      const user_requested = await User.findOne({ userName: requestedUserName });

      await user.updateOne({ $pull: { friendsPending: requestedUserName } });
      await user_requested.updateOne({ $pull: { friendsToAccept: user.userName } });
      console.log("Friend connection request withdrawn");
      res.status(200).send({ message: "Friend connection request withdrawn" });
    } else {
      console.log("User ID does not exist");
      res.status(401).json("User ID does not exist");
    }
  } catch (err) {
    console.log("SERVER ERROR: " + err);
    return res.status(500).json(err);
  }
});

module.exports = router;
