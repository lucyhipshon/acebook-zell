const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const UsersController = require("../controllers/users");


router.post("/", upload.single("profileImage"), UsersController.create); //images

router.get("/", UsersController.getAllUsers);
router.post("/", UsersController.create);


const User = require('../models/user'); 

const tokenChecker = require('../middleware/tokenChecker'); 




router.get('/profile', tokenChecker, async (req, res) => {
    try {
        const user = await User.findById(req.user_id).select('firstName lastName bio profileImage backgroundImage'); // this is where to add db fields if needed in ProfilePage.jsx
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});
        


// Route to update background image
router.post('/upload-background/:userId', upload.single('backgroundImage'), async (req, res) => {
  console.log('Upload route hit');
  try {
    const userId = req.params.userId;

    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    console.log('File saved at:', filePath);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { backgroundImage: filePath },
      { new: true }
    );

    console.log('User updated:', updatedUser);

    res.status(200).json({ backgroundImage: filePath, user: updatedUser });
  } catch (error) {
    console.error('Background upload error:', error);
    res.status(500).json({ error: 'Server error while uploading background image' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
