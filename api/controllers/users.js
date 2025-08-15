const JWT = require("jsonwebtoken");
const User = require("../models/user");

function create(req, res) {
  console.log("signup data:", req.body);

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

  const user = new User({ email, password, firstName, lastName, bio, job, location, gender, relationshipStatus, birthdate});

  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());

      const token = JWT.sign(
        { sub: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.status(201).json({token});
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
