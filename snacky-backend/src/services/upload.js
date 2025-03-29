const multer = require("multer");
const express = require('express');
const app = express();

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const userId = req.uid;

        console.log("UID detachhed ", file);
        
       cb(null, Date.now() + '-' + req.headers.uid + '-' + file.originalname) 
    }
});

const uploadFileService = multer({ storage})
module.exports = { uploadFileService };