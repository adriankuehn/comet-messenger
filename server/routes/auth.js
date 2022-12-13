const router = require("express").Router();
const User = require("../models/user");
const NameTable = require("../models/nametable");

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseKey: req.body.firebaseKey });
    if (!user) return res.status(401).send({ message: "Firebase Key not registered" });
    // Userdata with MongoDB-UserID is only revealed when user has verified his Email adress, this is done by the client and only possible
    // by domain comet - messenger.com
    // So nobody with an other domain is be able to sign in to firebase and retrieve the firebaseKey in order to get
    // the MongoDb-Id without an verified Email
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("LoginError: " + error);
  }
});

router.post("/check_register", async (req, res) => {
  try {
    const allowed_letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      ".",
      "_",
      "-",
      "@",
    ];
    var email_value = req.body.email;
    var userName_value = req.body.userName;
    for (var i_al = 0; i_al < userName_value.length; i_al++) {
      if (!allowed_letters.includes(userName_value[i_al])) {
        return res.status(409).send({ message: "Only english letters, figures and . - _ @ are allowed in user name" });
      }
    }
    for (var i_al = 0; i_al < email_value.length; i_al++) {
      if (!allowed_letters.includes(email_value[i_al])) {
        return res.status(409).send({ message: "Only english letters, figures and . - _ @ are allowed in email address" });
      }
    }

    const check_user_exists = await User.findOne({ email: req.body.email });
    if (check_user_exists) return res.status(409).send({ message: "Email not available" });
    const check_user_exists_2 = await User.findOne({ userName: req.body.userName });
    if (check_user_exists_2) return res.status(409).send({ message: "User Name not available" });

    res.status(201).send({ message: "User credentials are available" });
    console.log("User credentials are available!");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("Error while checking for potential new user: " + error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const allowed_letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      ".",
      "_",
      "-",
      "@",
    ];
    var email_value = req.body.email;
    var userName_value = req.body.userName;
    var firebaseKey = req.body.firebaseKey;
    for (var i_al = 0; i_al < userName_value.length; i_al++) {
      if (!allowed_letters.includes(userName_value[i_al])) {
        return res.status(409).send({ message: "Only english letters, figures and . - _ @ are allowed in user name" });
      }
    }
    for (var i_al = 0; i_al < email_value.length; i_al++) {
      if (!allowed_letters.includes(email_value[i_al])) {
        return res.status(409).send({ message: "Only english letters, figures and . - _ @ are allowed in email address" });
      }
    }

    const check_user_exists = await User.findOne({ email: req.body.email });
    if (check_user_exists) return res.status(409).send({ message: "Email not available" });
    const check_user_exists_2 = await User.findOne({ userName: req.body.userName });
    if (check_user_exists_2) return res.status(409).send({ message: "User Name not available" });

    //const salt = await bcrypt.genSalt(10043);
    //const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ userName: req.body.userName, email: req.body.email, firebaseKey: firebaseKey }).save();
    const table_result = await NameTable.find({});
    await NameTable.findOneAndUpdate({ _id: table_result[0]._id }, { $push: { userNames: req.body.userName } });
    res.status(201).send({ message: "User created successfully" });
    console.log("User created sucessfully: " + req.body.email);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("Error while creating new user: " + error);
  }
});

module.exports = router;
