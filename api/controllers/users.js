const { generateToken } = require("../lib/token");
const User = require("../models/user");

async function create(req, res) {
  console.log("signup data:", req.body);
  console.log("file info:", req.file); // profile picture

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const bio = req.body.bio;
  const job = req.body.job;
  const location = req.body.location;
  const gender = req.body.gender;
  const relationshipStatus = req.body.relationshipStatus;
  const birthdate = req.body.birthdate;

  const profileImage = req.file? `/uploads/${req.file.filename}` : "uploads/default.jpg"; // default profile pic


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

  const user = new User({ email, password, firstName, lastName, bio, job, location, gender, relationshipStatus, birthdate, profileImage});
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());

      const token = generateToken(user._id);
      
      res.status(201).json({token});
    })
      
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    const token = generateToken(req.user_id);
    res.status(200).json({users: users, token: token});
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Something went wrong."});
  }
}

const UsersController = {
  create: create,
  getAllUsers: getAllUsers,
};

module.exports = UsersController;
