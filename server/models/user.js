const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, min: 3, max: 20 },
  email: { type: String, required: true, max: 50 },
  profilePicture: { type: String, default: "" },
  friends: { type: Array, default: [] },
  friendsPending: { type: Array, default: [] },
  friendsToAccept: { type: Array, default: [] },
  description: { type: String, max: 50 },
  conversations: { type: Array, default: [] },
  posts: { type: Array, default: [] },
  firebaseKey: { type: String, required: true },
});

/*userSchema.methods.generateAuthToken = function () {    //=> for later use => user_key (user._id) should be encrypted in local storage of client so that no one else can simply read it out and can make direkt queries on the database (would need JWTPRIVATEKEY for this)
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};*/

module.exports = mongoose.model("User", userSchema);
