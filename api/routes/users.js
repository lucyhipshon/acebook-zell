const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);


const User = require('../models/user'); 

const tokenChecker = require('../middleware/tokenChecker'); 

router.get('/profile', tokenChecker, async (req, res) => {
    try {
        const user = await User.findById(req.user_id).select('firstname bio');
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});
        


module.exports = router;
