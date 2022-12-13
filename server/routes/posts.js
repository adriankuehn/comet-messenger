const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");

//add post to user account
router.post("/", async (req, res) => {
  console.log('New post upload');
  try {
    const user = await User.findById(req.body.user_id);
    if (user) {
      const newPost = new Post({ picture: req.body.selectedFile, describtion: req.body.describtion });
      const savedPost = await newPost.save();
      await user.updateOne({ $push: { posts: savedPost._id } });
      res.status(200).json(savedPost);
    } else {
      console.log("User ID does not exist");
      res.status(400).json("User ID does not exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post
router.post("/delete", async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (user) {
      const post = await Post.findById(req.body.post_id);
      if (post) {
        await user.updateOne({ $pull: { posts: post._id } });
        await Post.deleteOne({ _id: post._id });
        res.json({ status: 200, message: "Succesfully deleted post" });
      } else {
        console.log("Post ID does not exist");
        res.status(400).json("Post ID does not exist");
      }
    } else {
      console.log("User ID does not exist");
      res.status(400).json("User ID does not exist");
    }
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json(err);
  }
});

//get all post from specific userId (own account)
router.get("/:userId", async (req, res) => {
  try {
    array_posts = [];
    const user = await User.findById(req.params.userId);
    if (user) {
      for (var i_pos = 0; i_pos < user.posts.length; i_pos++) {
        const post = await Post.findById(user.posts[i_pos]);
        if (post) {
          array_posts.push(post);
        }
      }
      //console.log("array_posts LENGTHH: " + array_posts.length);
      res.status(200).json(array_posts);
    } else {
      console.log("User ID does not exist");
      res.status(400).json("User ID does not exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all post from specific username (other account) - only possible if they are friends
router.get("/otheruser/:userId/:receiverName", async (req, res) => {
  try {
    array_posts = [];
    const ownuser = await User.findById(req.params.userId);
    const otheruser = await User.findOne({ userName: req.params.receiverName });
    if (ownuser && otheruser) {
      for (var i_pos = 0; i_pos < otheruser.posts.length; i_pos++) {
        const post = await Post.findById(otheruser.posts[i_pos]);
        if (post) {
          array_posts.push(post);
        }
      }
      res.status(200).json(array_posts);
    } else {
      console.log("User ID or Receiver Name does not exist");
      res.status(400).json("User ID or Receiver Name does not exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//give a like to an other user's post
router.post("/givelike", async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    const otheruser = await User.findOne({ userName: req.body.receiverName });
    if (user && otheruser) {
      const updatedPost = await Post.findOneAndUpdate({ _id: req.body.post_id }, { $push: { likes: user.userName } });
      res.status(200).json(updatedPost);
    } else {
      console.log("User ID or Receiver Name does not exist");
      res.status(400).json("User ID or Receiver Name does not exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
