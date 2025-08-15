const User = require("../models/user");

async function create(req, res) {
  console.log("signup data:", req.body);

  const email = req.body.email;
  const password = req.body.password;

  if (!password || password.length < 8) {
    console.log("Password must be at least 8 characters.");
    return res.status(400).json({message: "Password must be at least 8 characters."});
  }

  const existingEmail = await User.findOne({email});
  if (existingEmail) {
    console.log("Email is already in use.");
    return res.status(400).json({message: "Email is already in use. Try to sign up with another email or log in."})
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format.")
    return res.status(400).json({message: "Invalid email format."})
  }

  const user = new User({ email, password });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

const UsersController = {
  create: create,
};

module.exports = UsersController;
