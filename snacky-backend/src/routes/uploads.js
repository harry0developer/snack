const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');

const uploadRoute = require('./routes/upload');

app.use('/uploads', express.static('uploads')); // Serve images
app.use('/api', uploadRoute);

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Upload endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { image, uid } = req.body;

    const newUser = new User({
      uid,
      image: req.file.path
    });

    await newUser.save();

    res.json({
      message: 'Image uploaded successfully',
      data: newUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
