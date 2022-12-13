const router = require("express").Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");

//add
router.post("/", async (req, res) => {
  const newMessage = new Message({ sender: req.body.sender, text: req.body.text });
  try {
    const savedMessage = await newMessage.save();
    const updatedConversation = await Conversation.findOneAndUpdate({ _id: req.body.conversationId }, { $push: { messages: savedMessage._id } });
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
router.get("/:conversationId", async (req, res) => {
  try {
    array_messages = [];
    const conversation = await Conversation.findById(req.params.conversationId);
    for (var i_mes = 0; i_mes < conversation.messages.length; i_mes++) {
      const message = await Message.findById(conversation.messages[i_mes]);
      if (message) {
        array_messages.push(message);
      }
    }
    res.status(200).json(array_messages);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
