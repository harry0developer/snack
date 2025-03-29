const express = require('express');
const { uploadFileService } = require('../services/upload');
const router = express.Router();
const { postImage } = require("../controllers/images");


router.post('/', uploadFileService.single('image'), postImage);

module.exports = { router }; 