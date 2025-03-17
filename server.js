//set up dependencies
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
//custom middleware
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

dotenv.config();

//set up controllers
const authController = require("./controllers/auth.js");

//set up port
const port = process.env.PORT ? process.env.PORT : "3000";

//connect to database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//mount middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    //this stores the session in the database so it won't be lost
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passUserToView);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use("/auth", authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
