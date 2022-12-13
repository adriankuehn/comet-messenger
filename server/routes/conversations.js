const router = require("express").Router();
const Conversation = require("../models/conversation");
const User = require("../models/user");

//new conv
router.post("/", async (req, res) => {
  /* Not needed anymore, code added to user route and acceptRequest in order to prevent multiple connections */
});

//get all conversations of a user
router.get("/:userId", async (req, res) => {
  try {
    array_conversations = [];
    const user = await User.findById(req.params.userId);
    for (var i_conv = 0; i_conv < user.conversations.length; i_conv++) {
      array_conversations.push( await Conversation.findById(user.conversations[i_conv]));
    }
    res.status(200).json(array_conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
