const bcrypt = require("bcrypt");
const User = require("../models/user.js");

exports.signOut = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.signUp = async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    // Username is not taken already!
    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // All ready to create the new user!
    const user = await User.create(req.body);

    // since they just signed in, store the user in the session and don't make them sign in
    req.session.user = {
      username: user.username,
      _id: user._id,
    };

    //save the session in the DB before proceeding
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

exports.signIn = async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send("Login failed. Please try again.");
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    //save the session in the DB before proceeding
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
