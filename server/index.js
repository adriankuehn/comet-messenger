require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const postRoute = require("./routes/posts");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");


mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Successfully connected to MongoDB");
  }
);

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(express.json());
app.use(cors());
app.use(fileupload());

app.get("/", (req, res) => {
  res.send("Comet-Messenger Backend API");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute); 
app.use("/api/posts", postRoute); 

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
